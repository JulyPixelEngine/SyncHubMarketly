package com.synchub.marketly.presentation.api;

import com.synchub.marketly.application.scraper.ScraperApplicationService;
import com.synchub.marketly.application.scraper.dto.ScrapeJobResponse;
import com.synchub.marketly.application.scraper.dto.ScrapeResultResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/scraper")
public class ScraperController {

    private final ScraperApplicationService scraperApplicationService;

    public ScraperController(ScraperApplicationService scraperApplicationService) {
        this.scraperApplicationService = scraperApplicationService;
    }

    @PostMapping("/start")
    public ResponseEntity<ScrapeJobResponse> startScraping() {
        return ResponseEntity.status(HttpStatus.ACCEPTED)
                .body(scraperApplicationService.startScraping());
    }

    @GetMapping("/jobs/{id}")
    public ResponseEntity<ScrapeJobResponse> getJobStatus(@PathVariable Long id) {
        return ResponseEntity.ok(scraperApplicationService.getJobStatus(id));
    }

    @GetMapping("/jobs")
    public ResponseEntity<List<ScrapeJobResponse>> getRecentJobs() {
        return ResponseEntity.ok(scraperApplicationService.getRecentJobs());
    }

    @GetMapping("/jobs/{id}/results")
    public ResponseEntity<ScrapeResultResponse> getJobResults(@PathVariable Long id) {
        return ResponseEntity.ok(scraperApplicationService.getJobResults(id));
    }

    @GetMapping("/latest")
    public ResponseEntity<ScrapeResultResponse> getLatestResults() {
        return ResponseEntity.ok(scraperApplicationService.getLatestResults());
    }
}
