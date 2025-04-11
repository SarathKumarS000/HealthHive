package com.healthhive.controller;

import com.healthhive.dto.PersonalInsightsDTO;
import com.healthhive.service.InsightsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/insights")
@RequiredArgsConstructor
public class InsightsController {

    private final InsightsService insightsService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getCommunityInsights() {
        return ResponseEntity.ok(insightsService.getAggregatedData());
    }

    @GetMapping("/personal/{userId}")
    public ResponseEntity<PersonalInsightsDTO> getPersonalInsights(@PathVariable Long userId) {
        return ResponseEntity.ok(insightsService.getPersonalInsights(userId));
    }
}
