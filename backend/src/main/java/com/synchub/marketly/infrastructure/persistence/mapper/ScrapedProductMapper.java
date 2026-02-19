package com.synchub.marketly.infrastructure.persistence.mapper;

import com.synchub.marketly.domain.scraper.ScrapedProduct;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ScrapedProductMapper {

    void insertBatch(@Param("products") List<ScrapedProduct> products);

    List<ScrapedProduct> findByJobId(@Param("jobId") Long jobId);
}
