package com.synchub.marketly.infrastructure.crawler;

import com.microsoft.playwright.Browser;
import com.microsoft.playwright.BrowserContext;
import com.microsoft.playwright.BrowserType;
import com.microsoft.playwright.Playwright;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class PlaywrightBrowserManager {

    private static final Logger log = LoggerFactory.getLogger(PlaywrightBrowserManager.class);

    private final ScraperProperties properties;
    private Playwright playwright;
    private Browser browser;

    public PlaywrightBrowserManager(ScraperProperties properties) {
        this.properties = properties;
    }

    @PostConstruct
    public void init() {
        log.info("Initializing Playwright browser (headless={})", properties.isHeadless());
        playwright = Playwright.create();
        browser = playwright.chromium().launch(
                new BrowserType.LaunchOptions().setHeadless(properties.isHeadless())
        );
        log.info("Playwright browser initialized successfully");
    }

    @PreDestroy
    public void destroy() {
        log.info("Shutting down Playwright browser");
        if (browser != null) {
            browser.close();
        }
        if (playwright != null) {
            playwright.close();
        }
    }

    public BrowserContext newContext() {
        return browser.newContext(
                new Browser.NewContextOptions()
                        .setUserAgent(properties.getUserAgent())
        );
    }
}
