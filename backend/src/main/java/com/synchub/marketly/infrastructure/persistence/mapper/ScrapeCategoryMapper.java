package com.synchub.marketly.infrastructure.persistence.mapper;

import com.synchub.marketly.domain.scraper.ScrapeCategory;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Optional;

@Mapper
public interface ScrapeCategoryMapper {

    List<ScrapeCategory> findAllActive();

    Optional<ScrapeCategory> findById(Long id);
}
