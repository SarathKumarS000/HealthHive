package com.healthhive.controller;

import com.healthhive.dto.DailySummaryDTO;
import com.healthhive.dto.HealthDataDTO;
import com.healthhive.model.HealthData;
import com.healthhive.service.HealthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
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

    @PutMapping("/{id}")
    public ResponseEntity<HealthData> updateLog(@PathVariable Long id, @RequestBody HealthData updatedLog) {
        return ResponseEntity.ok(healthService.updateLog(id, updatedLog));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLog(@PathVariable Long id) {
        healthService.deleteLog(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/summary/{userId}")
    public ResponseEntity<List<DailySummaryDTO>> getDailySummary(@PathVariable Long userId) {
        return ResponseEntity.ok(healthService.getUserDailySummaries(userId));
    }
}
