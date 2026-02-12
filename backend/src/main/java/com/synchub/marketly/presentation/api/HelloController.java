package com.synchub.marketly.presentation.api;

import com.synchub.marketly.application.greeting.dto.GreetingResponse;
import com.synchub.marketly.domain.greeting.GreetingService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class HelloController {

    private final GreetingService greetingService;

    public HelloController(GreetingService greetingService) {
        this.greetingService = greetingService;
    }

    @GetMapping("/hello")
    public GreetingResponse hello() {
        return new GreetingResponse(greetingService.getGreeting());
    }
}
