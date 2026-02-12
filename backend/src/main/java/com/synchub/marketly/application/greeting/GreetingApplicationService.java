package com.synchub.marketly.application.greeting;

import com.synchub.marketly.domain.greeting.GreetingService;
import org.springframework.stereotype.Service;

@Service
public class GreetingApplicationService implements GreetingService {

    @Override
    public String getGreeting() {
        return "Hello from Spring Boot!";
    }
}
