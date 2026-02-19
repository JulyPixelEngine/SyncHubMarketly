package com.synchub.marketly.application.scraper;

import com.microsoft.playwright.BrowserContext;
import com.synchub.marketly.domain.scraper.ScrapeCategory;
import com.synchub.marketly.domain.scraper.ScrapedProduct;
import com.synchub.marketly.infrastructure.crawler.CategoryCrawler;
import com.synchub.marketly.infrastructure.crawler.PlaywrightBrowserManager;
import com.synchub.marketly.infrastructure.crawler.ScraperProperties;
import com.synchub.marketly.infrastructure.persistence.mapper.ScrapeJobMapper;
import com.synchub.marketly.infrastructure.persistence.mapper.ScrapedProductMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ScraperExecutionService {

    private static final Logger log = LoggerFactory.getLogger(ScraperExecutionService.class);

    private final ScrapeJobMapper jobMapper;
    private final ScrapedProductMapper productMapper;
    private final PlaywrightBrowserManager browserManager;
    private final CategoryCrawler categoryCrawler;
    private final ScraperProperties properties;

    public ScraperExecutionService(ScrapeJobMapper jobMapper,
                                   ScrapedProductMapper productMapper,
                                   PlaywrightBrowserManager browserManager,
                                   CategoryCrawler categoryCrawler,
                                   ScraperProperties properties) {
        this.jobMapper = jobMapper;
        this.productMapper = productMapper;
        this.browserManager = browserManager;
        this.categoryCrawler = categoryCrawler;
        this.properties = properties;
    }

    @Async("scraperExecutor")
    @Transactional
    public void execute(Long jobId, List<ScrapeCategory> categories) {
        log.info("Starting scrape job #{} with {} categories", jobId, categories.size());
        jobMapper.updateStatus(jobId, "RUNNING", null);

        try {
            BrowserContext context = browserManager.newContext();
            try {
                int scraped = 0;
                for (ScrapeCategory category : categories) {
                    List<ScrapedProduct> products = scrapeWithRetry(context, category);
                    products.forEach(p -> {
                        p.setJobId(jobId);
                        p.setCategoryId(category.getId());
                    });

                    if (!products.isEmpty()) {
                        productMapper.insertBatch(products);
                    }

                    scraped++;
                    jobMapper.updateProgress(jobId, scraped);
                    log.info("Job #{}: scraped {}/{} categories", jobId, scraped, categories.size());

                    // Rate limiting delay between categories — intentional sleep between requests
                    if (scraped < categories.size()) {
                        Thread.sleep(properties.getRequestDelayMs());
                    }
                }
            } finally {
                context.close();
            }

            jobMapper.markCompleted(jobId);
            log.info("Scrape job #{} completed successfully", jobId);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            jobMapper.updateStatus(jobId, "FAILED", "Job interrupted");
            log.error("Scrape job #{} interrupted", jobId);
        } catch (Exception e) {
            jobMapper.updateStatus(jobId, "FAILED", e.getMessage());
            log.error("Scrape job #{} failed: {}", jobId, e.getMessage(), e);
        }
    }

    private List<ScrapedProduct> scrapeWithRetry(BrowserContext context, ScrapeCategory category) {
        for (int attempt = 1; attempt <= properties.getMaxRetries(); attempt++) {
            try {
                return categoryCrawler.scrape(context, category, properties.getTopN());
            } catch (Exception e) {
                log.warn("Scrape attempt {}/{} failed for {}: {}",
                        attempt, properties.getMaxRetries(), category.getName(), e.getMessage());
                if (attempt == properties.getMaxRetries()) {
                    throw e;
                }
                try {
                    Thread.sleep(attempt * 2000L);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    throw new RuntimeException("Retry interrupted", ie);
                }
            }
        }
        return List.of();
    }
}
