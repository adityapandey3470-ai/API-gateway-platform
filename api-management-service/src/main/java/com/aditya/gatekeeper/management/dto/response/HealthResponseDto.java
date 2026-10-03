package com.aditya.gatekeeper.management.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class HealthResponseDto {

    private String serviceName;
    private String serviceDescription;
    private String appStatus;
}
