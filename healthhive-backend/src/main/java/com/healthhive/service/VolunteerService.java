package com.healthhive.service;

import com.healthhive.model.User;
import com.healthhive.model.VolunteerOpportunity;
import com.healthhive.repository.UserRepository;
import com.healthhive.repository.VolunteerOpportunityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class VolunteerService {
    @Autowired
    private VolunteerOpportunityRepository repository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    public List<VolunteerOpportunity> getAllOpportunities() {
        return repository.findAll();
    }

    public VolunteerOpportunity createOpportunity(VolunteerOpportunity opportunity) {
        if (opportunity.getDate() == null || opportunity.getDate().isBefore(LocalDate.now())) {
            throw new RuntimeException("Date must be today or a future date.");
        }
        if (opportunity.getTitle() == null || opportunity.getTitle().isBlank()) {
            throw new RuntimeException("Title is required.");
        }
        if (opportunity.getDescription() == null || opportunity.getDescription().isBlank()) {
            throw new RuntimeException("Description is required.");
        }
        if (opportunity.getLocation() == null || opportunity.getLocation().isBlank()) {
            throw new RuntimeException("Location is required.");
        }

        return repository.save(opportunity);
    }

    public void joinOpportunity(Long opportunityId, Long userId) {
        VolunteerOpportunity opportunity = repository.findById(opportunityId)
                .orElseThrow(() -> new RuntimeException("Opportunity not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        opportunity.getJoinedUsers().add(user);
        repository.save(opportunity);
        notificationService.sendNotification(
                user,
                "You have successfully joined the volunteer opportunity: " + opportunity.getTitle()
        );
    }
}

