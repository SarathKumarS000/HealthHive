package com.healthhive.controller;

import com.healthhive.service.CommunityInsightsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/insights")
@RequiredArgsConstructor
public class CommunityInsightsController {

    private final CommunityInsightsService insightsService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getCommunityInsights() {
        return ResponseEntity.ok(insightsService.getAggregatedData());
    }
}
