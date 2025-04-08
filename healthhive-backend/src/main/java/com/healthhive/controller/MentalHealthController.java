package com.healthhive.controller;

import com.healthhive.model.MentalHealthMessage;
import com.healthhive.repository.MentalHealthRepository;
import com.healthhive.service.MentalHealthSupportService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/mental-messages")
public class MentalHealthController {

    @Autowired
    private MentalHealthRepository repository;

    @Autowired
    private MentalHealthSupportService service;

    @GetMapping
    public ResponseEntity<?> getAllMessagesWithReactions() {
        return ResponseEntity.ok(service.getAllMessagesWithReactions());
    }

    @PostMapping
    public ResponseEntity<?> postMessage(@Valid @RequestBody MentalHealthMessage message) {
        message.setTimestamp(LocalDateTime.now());
        MentalHealthMessage saved = repository.save(message);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/{id}/react")
    public ResponseEntity<?> react(@PathVariable Long id, @RequestParam String type) {
        service.reactToMessage(id, type);
        return ResponseEntity.ok().build();
    }
}
