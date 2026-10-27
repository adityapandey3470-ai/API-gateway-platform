package com.aditya.gatekeeper.management.controller;

import com.aditya.gatekeeper.management.dto.response.HealthResponseDto;
import com.aditya.gatekeeper.management.service.HealthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
@RequestMapping("/health")
public class HealthController {

   public final HealthService healthService;



    @GetMapping
    public ResponseEntity<HealthResponseDto> health() {
        String databaseStatus = healthService.getHealth();
        return ResponseEntity.ok(
                new HealthResponseDto("Up", databaseStatus, LocalDateTime.now()));

    }


}
