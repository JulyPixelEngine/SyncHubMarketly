package com.synchub.marketly.application.scraper;

import com.synchub.marketly.application.scraper.dto.ScrapeJobResponse;
import com.synchub.marketly.application.scraper.dto.ScrapeResultResponse;
import com.synchub.marketly.application.scraper.dto.ScrapedProductResponse;
import com.synchub.marketly.domain.scraper.ScrapeCategory;
import com.synchub.marketly.domain.scraper.ScrapeJob;
import com.synchub.marketly.domain.scraper.ScrapedProduct;
import com.synchub.marketly.infrastructure.crawler.ScraperProperties;
import com.synchub.marketly.infrastructure.persistence.mapper.ScrapeCategoryMapper;
import com.synchub.marketly.infrastructure.persistence.mapper.ScrapeJobMapper;
import com.synchub.marketly.infrastructure.persistence.mapper.ScrapedProductMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ScraperApplicationService {

    private final ScrapeJobMapper jobMapper;
    private final ScrapedProductMapper productMapper;
    private final ScrapeCategoryMapper categoryMapper;
    private final ScraperExecutionService executionService;
    private final ScraperProperties properties;

    public ScraperApplicationService(ScrapeJobMapper jobMapper,
                                     ScrapedProductMapper productMapper,
                                     ScrapeCategoryMapper categoryMapper,
                                     ScraperExecutionService executionService,
                                     ScraperProperties properties) {
        this.jobMapper = jobMapper;
        this.productMapper = productMapper;
        this.categoryMapper = categoryMapper;
        this.executionService = executionService;
        this.properties = properties;
    }

    @Transactional
    public ScrapeJobResponse startScraping() {
        // Prevent concurrent execution
        jobMapper.findByStatus("RUNNING").ifPresent(job -> {
            throw new IllegalStateException("A scraping job is already running (Job #" + job.getId() + ")");
        });
        jobMapper.findByStatus("PENDING").ifPresent(job -> {
            throw new IllegalStateException("A scraping job is already pending (Job #" + job.getId() + ")");
        });

        // Check cache cooldown
        jobMapper.findLatestSuccessful().ifPresent(latest -> {
            if (latest.getCompletedAt() != null) {
                long minutesSince = ChronoUnit.MINUTES.between(latest.getCompletedAt(), LocalDateTime.now());
                if (minutesSince < properties.getCacheCooldownMinutes()) {
                    throw new IllegalStateException(
                            "Last scrape was " + minutesSince + " minutes ago. " +
                            "Cooldown period: " + properties.getCacheCooldownMinutes() + " minutes."
                    );
                }
            }
        });

        // Create job
        List<ScrapeCategory> categories = categoryMapper.findAllActive();
        if (categories.isEmpty()) {
            throw new IllegalStateException("No active scrape categories configured");
        }

        ScrapeJob job = new ScrapeJob();
        job.setStatus("PENDING");
        job.setTotalCategories(categories.size());
        job.setScrapedCount(0);
        jobMapper.insert(job);

        // Trigger async execution
        executionService.execute(job.getId(), categories);

        return ScrapeJobResponse.from(job);
    }

    public ScrapeJobResponse getJobStatus(Long jobId) {
        ScrapeJob job = jobMapper.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found: " + jobId));
        return ScrapeJobResponse.from(job);
    }

    public List<ScrapeJobResponse> getRecentJobs() {
        return jobMapper.findRecent(20).stream()
                .map(ScrapeJobResponse::from)
                .toList();
    }

    public ScrapeResultResponse getJobResults(Long jobId) {
        ScrapeJob job = jobMapper.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found: " + jobId));
        return buildResultResponse(job);
    }

    public ScrapeResultResponse getLatestResults() {
        ScrapeJob job = jobMapper.findLatestSuccessful()
                .orElse(null);
        if (job == null) {
            return new ScrapeResultResponse(null, Map.of());
        }
        return buildResultResponse(job);
    }

    private ScrapeResultResponse buildResultResponse(ScrapeJob job) {
        List<ScrapedProduct> products = productMapper.findByJobId(job.getId());
        List<ScrapeCategory> categories = categoryMapper.findAllActive();
        Map<Long, String> categoryNames = categories.stream()
                .collect(Collectors.toMap(ScrapeCategory::getId, ScrapeCategory::getName));

        Map<String, List<ScrapedProductResponse>> productsByCategory = products.stream()
                .collect(Collectors.groupingBy(
                        p -> categoryNames.getOrDefault(p.getCategoryId(), "Unknown"),
                        LinkedHashMap::new,
                        Collectors.mapping(
                                p -> ScrapedProductResponse.from(p, categoryNames.getOrDefault(p.getCategoryId(), "Unknown")),
                                Collectors.toList()
                        )
                ));

        return new ScrapeResultResponse(ScrapeJobResponse.from(job), productsByCategory);
    }
}
