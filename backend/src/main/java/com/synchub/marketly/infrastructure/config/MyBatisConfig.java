package com.synchub.marketly.infrastructure.config;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@MapperScan("com.synchub.marketly.infrastructure.persistence.mapper")
public class MyBatisConfig {
}
