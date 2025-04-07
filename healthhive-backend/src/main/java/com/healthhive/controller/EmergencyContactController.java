package com.healthhive.controller;

import com.healthhive.model.EmergencyContact;
import com.healthhive.repository.EmergencyContactRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/emergency-contacts")
public class EmergencyContactController {

    private final EmergencyContactRepository repo;

    public EmergencyContactController(EmergencyContactRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/{username}")
    public List<EmergencyContact> getContacts(@PathVariable String username) {
        return repo.findByUsername(username);
    }

    @PostMapping
    public EmergencyContact addContact(@RequestBody EmergencyContact contact) {
        return repo.save(contact);
    }
}
