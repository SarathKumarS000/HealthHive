package com.healthhive.controller;

import com.healthhive.model.User;
import com.healthhive.model.VolunteerOpportunity;
import com.healthhive.repository.UserRepository;
import com.healthhive.repository.VolunteerOpportunityRepository;
import com.healthhive.service.VolunteerService;
import com.healthhive.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/volunteer")
public class VolunteerController {

    @Autowired
    private VolunteerService service;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VolunteerOpportunityRepository repository;

    @GetMapping
    public List<VolunteerOpportunity> getAll() {
        return service.getAllOpportunities();
    }

    @PostMapping
    public ResponseEntity<VolunteerOpportunity> create(
            @RequestBody VolunteerOpportunity opportunity,
            @CookieValue(name = "jwt", required = false) String token
    ) {
        if (token == null) return ResponseEntity.status(401).build();

        String username = jwtUtil.extractUsername(token);
        User user = userRepository.findByUsername(username).orElseThrow();
        opportunity.setPostedBy(user);

        VolunteerOpportunity created = service.createOpportunity(opportunity);
        return ResponseEntity.ok(created);
    }


    @PostMapping("/{id}/join")
    public ResponseEntity<?> join(@PathVariable Long id, @RequestParam Long userId) {
        service.joinOpportunity(id, userId);
        return ResponseEntity.ok("Joined successfully!");
    }

    @GetMapping("/joined/{userId}")
    public List<Long> getJoinedOpportunityIds(@PathVariable Long userId) {
        return repository.findByJoinedUserId(userId)
                .stream()
                .map(VolunteerOpportunity::getId)
                .toList();
    }
}
