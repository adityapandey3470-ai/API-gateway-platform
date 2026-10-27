package com.aditya.gatekeeper.management.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class HealthResponseDto {

    private String serviceStatus;
    private String databaseStatus;
    private LocalDateTime timestamp;
}
