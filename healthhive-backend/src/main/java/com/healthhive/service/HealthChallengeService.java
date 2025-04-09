package com.healthhive.service;

import com.healthhive.dto.ChallengeProgressDTO;
import com.healthhive.model.HealthChallenge;
import com.healthhive.model.User;
import com.healthhive.repository.HealthChallengeRepository;
import com.healthhive.repository.HealthDataRepository;
import com.healthhive.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HealthChallengeService {

    private final HealthChallengeRepository challengeRepository;
    private final UserRepository userRepository;
    private final HealthDataRepository healthDataRepository;

    public HealthChallenge save(HealthChallenge challenge) {
        return challengeRepository.save(challenge);
    }

    public List<HealthChallenge> getAll() {
        return challengeRepository.findAll();
    }

    public List<HealthChallenge> getUserChallenges(Long userId) {
        return challengeRepository.findByUserId(userId);
    }

    public HealthChallenge joinChallenge(Long challengeId, Long userId) {
        HealthChallenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new RuntimeException("Challenge not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!challenge.getParticipants().contains(user)) {
            challenge.getParticipants().add(user);
            return challengeRepository.save(challenge);
        }
        return challenge;
    }

    public void cancelJoin(Long challengeId, Long userId) {
        HealthChallenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new RuntimeException("Challenge not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (challenge.getParticipants().contains(user)) {
            challenge.getParticipants().remove(user);
            challengeRepository.save(challenge);
        }
    }

    public List<ChallengeProgressDTO> getUserChallengeProgress(Long userId) {
        List<HealthChallenge> challenges = challengeRepository.findByParticipants_Id(userId);
        List<ChallengeProgressDTO> dtos = new ArrayList<>();

        for (HealthChallenge challenge : challenges) {
            Integer achieved = 0;
            if ("steps".equalsIgnoreCase(challenge.getGoalType())) {
                achieved = healthDataRepository.sumStepsBetween(userId, challenge.getStartDate(), challenge.getEndDate());
            } else if ("calories".equalsIgnoreCase(challenge.getGoalType())) {
                achieved = healthDataRepository.sumCaloriesBetween(userId, challenge.getStartDate(), challenge.getEndDate());
            }
            if (achieved == null) achieved = 0;

            int percentage = (int) ((achieved / (double) challenge.getGoal()) * 100);
            dtos.add(new ChallengeProgressDTO(
                    challenge.getId(),
                    challenge.getTitle(),
                    challenge.getGoal(),
                    achieved,
                    challenge.getGoalType(),
                    Math.min(percentage, 100)
            ));
        }
        return dtos;
    }
}
