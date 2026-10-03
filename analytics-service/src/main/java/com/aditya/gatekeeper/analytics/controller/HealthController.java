package com.aditya.gatekeeper.analytics.controller;

import com.aditya.gatekeeper.analytics.dto.response.HealthResponseDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/health")
public class HealthController {

    private final String serviceName;
    private final String serviceDescription;

    public HealthController(@Value("${application.name}") String serviceName,
                            @Value("${application.description}") String serviceDescription) {
        this.serviceName = serviceName;
        this.serviceDescription = serviceDescription;
    }

    @GetMapping("/check")
    public ResponseEntity<HealthResponseDto> check() {
        return ResponseEntity.ok(
                new HealthResponseDto(serviceName, serviceDescription, "UP"));
    }
}
