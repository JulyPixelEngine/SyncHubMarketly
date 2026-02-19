package com.synchub.marketly.application.scraper.dto;

import com.synchub.marketly.domain.scraper.ScrapeJob;

import java.time.LocalDateTime;

public record ScrapeJobResponse(
        Long id,
        String status,
        Integer totalCategories,
        Integer scrapedCount,
        String errorMessage,
        LocalDateTime startedAt,
        LocalDateTime completedAt,
        LocalDateTime createdAt
) {

    public static ScrapeJobResponse from(ScrapeJob job) {
        return new ScrapeJobResponse(
                job.getId(),
                job.getStatus(),
                job.getTotalCategories(),
                job.getScrapedCount(),
                job.getErrorMessage(),
                job.getStartedAt(),
                job.getCompletedAt(),
                job.getCreatedAt()
        );
    }
}
