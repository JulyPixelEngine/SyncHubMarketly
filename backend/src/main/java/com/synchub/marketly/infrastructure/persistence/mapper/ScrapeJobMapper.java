package com.synchub.marketly.infrastructure.persistence.mapper;

import com.synchub.marketly.domain.scraper.ScrapeJob;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface ScrapeJobMapper {

    void insert(ScrapeJob job);

    void updateStatus(@Param("id") Long id, @Param("status") String status,
                      @Param("errorMessage") String errorMessage);

    void updateProgress(@Param("id") Long id, @Param("scrapedCount") Integer scrapedCount);

    void markCompleted(@Param("id") Long id);

    Optional<ScrapeJob> findById(Long id);

    List<ScrapeJob> findRecent(@Param("limit") int limit);

    Optional<ScrapeJob> findLatestSuccessful();

    Optional<ScrapeJob> findByStatus(@Param("status") String status);
}
