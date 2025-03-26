package com.healthhive.controller;

import com.healthhive.dto.HealthDataDTO;
import com.healthhive.model.HealthData;
import com.healthhive.service.HealthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/health")
@RequiredArgsConstructor
public class HealthController {

    private final HealthService healthService;

    @PostMapping("/log")
    public ResponseEntity<String> logHealthData(@RequestBody HealthDataDTO healthData) {
        healthService.logHealthData(healthData);
        return ResponseEntity.ok("Health data logged successfully!");
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<HealthData>> getUserHealthData(@PathVariable Long userId) {
        return ResponseEntity.ok(healthService.getUserHealthData(userId));
    }
}
