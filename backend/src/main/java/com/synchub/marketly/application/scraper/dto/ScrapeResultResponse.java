package com.synchub.marketly.application.scraper.dto;

import java.util.List;
import java.util.Map;

public record ScrapeResultResponse(
        ScrapeJobResponse job,
        Map<String, List<ScrapedProductResponse>> productsByCategory
) {
}
