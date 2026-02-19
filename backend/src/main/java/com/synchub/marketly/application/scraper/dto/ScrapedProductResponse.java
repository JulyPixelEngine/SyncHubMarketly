package com.synchub.marketly.application.scraper.dto;

import com.synchub.marketly.domain.scraper.ScrapedProduct;

import java.time.LocalDateTime;

public record ScrapedProductResponse(
        Long id,
        String categoryName,
        Integer rank,
        String productName,
        String price,
        String imageUrl,
        String productUrl,
        String sourceSite,
        LocalDateTime scrapedAt
) {

    public static ScrapedProductResponse from(ScrapedProduct product, String categoryName) {
        return new ScrapedProductResponse(
                product.getId(),
                categoryName,
                product.getRank(),
                product.getProductName(),
                product.getPrice(),
                product.getImageUrl(),
                product.getProductUrl(),
                product.getSourceSite(),
                product.getScrapedAt()
        );
    }
}
