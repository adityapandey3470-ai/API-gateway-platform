package com.aditya.gatekeeper.management.service;

import com.aditya.gatekeeper.management.dto.response.HealthResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class HealthService {

    private final JdbcTemplate jdbcTemplate;

    public String getHealth() {

        String dataBaseStatus = "Down";

        try {
            Integer result = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            if (Integer.valueOf(1).equals(result)) {
                dataBaseStatus = "Up";
            }
        } catch (Exception e) {
            System.out.println("Database connection failed: " + e.getMessage());
        }
        return dataBaseStatus;
    }

}
