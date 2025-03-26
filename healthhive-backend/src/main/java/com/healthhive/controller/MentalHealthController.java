package com.healthhive.controller;

import com.healthhive.dto.MentalHealthDTO;
import com.healthhive.service.MentalHealthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/mentalhealth")
@RequiredArgsConstructor
public class MentalHealthController {

    private final MentalHealthService mentalHealthService;

    @PostMapping("/check-in")
    public ResponseEntity<String> checkIn(@RequestBody MentalHealthDTO mentalHealth) {
        mentalHealthService.logCheckIn(mentalHealth);
        return ResponseEntity.ok("Mental health check-in logged!");
    }
}
