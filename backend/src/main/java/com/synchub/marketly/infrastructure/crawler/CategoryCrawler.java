package com.synchub.marketly.infrastructure.crawler;

import com.microsoft.playwright.BrowserContext;
import com.synchub.marketly.domain.scraper.ScrapeCategory;
import com.synchub.marketly.domain.scraper.ScrapedProduct;

import java.util.List;

public interface CategoryCrawler {

    List<ScrapedProduct> scrape(BrowserContext context, ScrapeCategory category, int topN);
}
