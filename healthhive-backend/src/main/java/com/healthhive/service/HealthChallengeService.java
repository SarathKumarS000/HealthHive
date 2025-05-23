package com.healthhive.service;

import com.healthhive.dto.ChallengeProgressDTO;
import com.healthhive.dto.ChallengeStatsDTO;
import com.healthhive.model.HealthChallenge;
import com.healthhive.model.User;
import com.healthhive.repository.HealthChallengeRepository;
import com.healthhive.repository.HealthDataRepository;
import com.healthhive.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class HealthChallengeService {

    private final HealthChallengeRepository challengeRepository;
    private final UserRepository userRepository;
    private final HealthDataRepository healthDataRepository;
    private final NotificationService notificationService;

    public HealthChallenge save(HealthChallenge challenge) {
        return challengeRepository.save(challenge);
    }

    public List<HealthChallenge> getAll() {
        return challengeRepository.findAllWithParticipantsSorted();
    }

    public List<HealthChallenge> getUserChallenges(Long userId) {
        return challengeRepository.findByUserId(userId);
    }

    public void joinChallenge(Long challengeId, Long userId) {
        HealthChallenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new RuntimeException("Challenge not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!challenge.getParticipants().contains(user)) {
            challenge.getParticipants().add(user);
            notificationService.sendNotification(user, "You've successfully joined the challenge: " + challenge.getTitle());
            challengeRepository.save(challenge);
        }
    }

    public void cancelJoin(Long challengeId, Long userId) {
        HealthChallenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new RuntimeException("Challenge not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (challenge.getParticipants().contains(user)) {
            challenge.getParticipants().remove(user);
            challengeRepository.save(challenge);
            notificationService.sendNotification(user, "You've cancelled your participation in: " + challenge.getTitle());
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
                    Math.min(percentage, 100),
                    challenge.getStartDate(),
                    challenge.getEndDate()
            ));
        }
        return dtos;
    }

    public Map<Long, ChallengeStatsDTO> getStatsForAllChallenges() {
        List<HealthChallenge> all = challengeRepository.findAll();

        Map<Long, ChallengeStatsDTO> statsMap = new HashMap<>();
        for (HealthChallenge challenge : all) {
            long challengeId = challenge.getId();
            int total = challenge.getParticipants().size();

            int completed = 0;
            for (User user : challenge.getParticipants()) {
                int sum = Optional.ofNullable(
                        healthDataRepository.sumByUserAndGoalTypeBetweenDates(
                                user.getId(),
                                challenge.getGoalType(),
                                challenge.getStartDate(),
                                challenge.getEndDate()
                        )
                ).orElse(0);

                if (sum >= challenge.getGoal()) {
                    completed++;
                }
            }

            ChallengeStatsDTO dto = new ChallengeStatsDTO();
            dto.setTotalParticipants(total);
            dto.setCompletedParticipants(completed);
            statsMap.put(challengeId, dto);
        }

        return statsMap;
    }
}
