package com.synchub.marketly.infrastructure.crawler;

import com.microsoft.playwright.APIResponse;
import com.microsoft.playwright.BrowserContext;
import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.options.LoadState;
import com.synchub.marketly.domain.scraper.ScrapeCategory;
import com.synchub.marketly.domain.scraper.ScrapedProduct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

@Component
public class DefaultCategoryCrawler implements CategoryCrawler {

    private static final Logger log = LoggerFactory.getLogger(DefaultCategoryCrawler.class);

    private final ScraperProperties properties;

    public DefaultCategoryCrawler(ScraperProperties properties) {
        this.properties = properties;
    }

    @Override
    public List<ScrapedProduct> scrape(BrowserContext context, ScrapeCategory category, int topN) {
        log.info("Scraping category: {} from {}", category.getName(), category.getTargetUrl());
        Page page = context.newPage();
        try {
            AtomicReference<String> interceptedData = new AtomicReference<>();

            // Network interception: capture API responses from SPA
            page.route("**/api/**", route -> {
                try {
                    APIResponse response = route.fetch();
                    String body = response.text();
                    if (body != null && body.contains("product")) {
                        interceptedData.set(body);
                    }
                    route.fulfill(new com.microsoft.playwright.Route.FulfillOptions()
                            .setStatus(response.status())
                            .setHeaders(response.headers())
                            .setBody(body));
                } catch (Exception e) {
                    log.debug("Route interception failed, continuing: {}", e.getMessage());
                    route.resume();
                }
            });

            // Navigate with timeout
            page.navigate(category.getTargetUrl(),
                    new Page.NavigateOptions().setTimeout(properties.getTimeoutMs()));

            // Wait for network to settle — NO hard sleep
            page.waitForLoadState(LoadState.NETWORKIDLE);

            List<ScrapedProduct> results;

            // Prefer intercepted API data over DOM scraping
            if (interceptedData.get() != null) {
                log.info("Using intercepted API data for category: {}", category.getName());
                results = parseInterceptedData(interceptedData.get(), category, topN);
            } else {
                log.info("Falling back to DOM extraction for category: {}", category.getName());
                results = extractFromDom(page, category, topN);
            }

            log.info("Scraped {} products from category: {}", results.size(), category.getName());
            return results;
        } finally {
            page.close();
        }
    }

    private List<ScrapedProduct> parseInterceptedData(String jsonData, ScrapeCategory category, int topN) {
        // Placeholder: actual JSON parsing depends on the target site's API structure.
        // Override this method or create site-specific crawlers for real implementation.
        log.debug("Intercepted data length: {} chars", jsonData.length());
        return new ArrayList<>();
    }

    private List<ScrapedProduct> extractFromDom(Page page, ScrapeCategory category, int topN) {
        List<ScrapedProduct> products = new ArrayList<>();
        String sourceSite = extractDomain(category.getTargetUrl());

        // Generic product selector — customize per target site
        // Common patterns: [data-product], .product-item, .ranking-item, li.product
        Locator items = page.locator("[data-product], .product-item, .ranking-item");
        int count = Math.min(items.count(), topN);

        for (int i = 0; i < count; i++) {
            try {
                Locator item = items.nth(i);
                ScrapedProduct product = new ScrapedProduct();
                product.setRank(i + 1);
                product.setCategoryId(category.getId());
                product.setSourceSite(sourceSite);

                // Extract product name — try common selectors
                String name = tryExtractText(item, "h2, h3, .product-name, .product-title, [data-name]");
                product.setProductName(name != null ? name : "Product #" + (i + 1));

                // Extract price
                String price = tryExtractText(item, ".price, .product-price, [data-price]");
                product.setPrice(price);

                // Extract image URL
                Locator img = item.locator("img").first();
                if (img.count() > 0) {
                    product.setImageUrl(img.getAttribute("src"));
                }

                // Extract product link
                Locator link = item.locator("a").first();
                if (link.count() > 0) {
                    product.setProductUrl(link.getAttribute("href"));
                }

                products.add(product);
            } catch (Exception e) {
                log.warn("Failed to extract product #{} from {}: {}", i + 1, category.getName(), e.getMessage());
            }
        }

        return products;
    }

    private String tryExtractText(Locator parent, String selectors) {
        for (String selector : selectors.split(",")) {
            try {
                Locator el = parent.locator(selector.trim()).first();
                if (el.count() > 0) {
                    String text = el.textContent();
                    if (text != null && !text.isBlank()) {
                        return text.trim();
                    }
                }
            } catch (Exception ignored) {
                // Try next selector
            }
        }
        return null;
    }

    private String extractDomain(String url) {
        try {
            return new URI(url).getHost();
        } catch (Exception e) {
            return url;
        }
    }
}
