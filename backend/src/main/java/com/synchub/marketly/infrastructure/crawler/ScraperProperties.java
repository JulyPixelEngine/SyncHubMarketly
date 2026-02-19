package com.synchub.marketly.infrastructure.crawler;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "scraper")
public class ScraperProperties {

    private boolean headless = true;
    private long requestDelayMs = 3000;
    private int cacheCooldownMinutes = 60;
    private int maxRetries = 3;
    private int timeoutMs = 30000;
    private String userAgent = "SyncHubMarketly-Bot/1.0";
    private int topN = 5;

    public boolean isHeadless() {
        return headless;
    }

    public void setHeadless(boolean headless) {
        this.headless = headless;
    }

    public long getRequestDelayMs() {
        return requestDelayMs;
    }

    public void setRequestDelayMs(long requestDelayMs) {
        this.requestDelayMs = requestDelayMs;
    }

    public int getCacheCooldownMinutes() {
        return cacheCooldownMinutes;
    }

    public void setCacheCooldownMinutes(int cacheCooldownMinutes) {
        this.cacheCooldownMinutes = cacheCooldownMinutes;
    }

    public int getMaxRetries() {
        return maxRetries;
    }

    public void setMaxRetries(int maxRetries) {
        this.maxRetries = maxRetries;
    }

    public int getTimeoutMs() {
        return timeoutMs;
    }

    public void setTimeoutMs(int timeoutMs) {
        this.timeoutMs = timeoutMs;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }

    public int getTopN() {
        return topN;
    }

    public void setTopN(int topN) {
        this.topN = topN;
    }
}
