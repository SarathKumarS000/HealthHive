package com.healthhive.service;

import com.healthhive.dto.DailySummaryDTO;
import com.healthhive.dto.HealthDataDTO;
import com.healthhive.model.HealthData;
import com.healthhive.model.User;
import com.healthhive.repository.HealthDataRepository;
import com.healthhive.repository.UserRepository;
import lombok.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HealthService {

    private final HealthDataRepository healthDataRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM dd, yyyy");

    public void logHealthData(HealthDataDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        validateDailyTotals(user.getId(), LocalDate.now(), null, dto.getSteps(), dto.getCalories(), dto.getSleepHours());

        HealthData healthData = new HealthData(
                null, user, dto.getSteps(), dto.getCalories(),
                dto.getWeight(), dto.getSleepHours(), dto.getMood(),
                LocalDateTime.now()
        );

        healthDataRepository.save(healthData);

        notificationService.sendNotification(user, "Health data logged successfully.");
    }

    public List<HealthData> getUserHealthData(Long userId) {
        return healthDataRepository.findByUserIdOrderByDateDesc(userId);
    }

    public HealthData updateLog(Long id, HealthData updatedLog) {
        HealthData existing = healthDataRepository.findById(id).orElseThrow();
        Long userId = existing.getUser().getId();
        LocalDate logDate = existing.getDate().toLocalDate();

        validateDailyTotals(userId, logDate, id,
                updatedLog.getSteps(), updatedLog.getCalories(), updatedLog.getSleepHours());

        existing.setSteps(updatedLog.getSteps());
        existing.setCalories(updatedLog.getCalories());
        existing.setSleepHours(updatedLog.getSleepHours());
        existing.setMood(updatedLog.getMood());
        existing.setDate(LocalDateTime.now());

        HealthData updated = healthDataRepository.save(existing);

        notificationService.sendNotification(existing.getUser(), "Health data updated.");

        return updated;
    }

    public void deleteLog(Long id) {
        HealthData log = healthDataRepository.findById(id).orElse(null);
        if (log != null) {
            healthDataRepository.deleteById(id);

            LocalDateTime logDate = log.getDate();
            String formattedDate = logDate.format(formatter);

            notificationService.sendNotification(
                    log.getUser(),
                    "Your health log for " + formattedDate + " has been deleted."
            );
        }
    }

    public void checkAndNotifyMissedLogs() {
        List<User> users = userRepository.findAll();
        LocalDate yesterday = LocalDate.now().minusDays(1);

        for (User user : users) {
            boolean hasLog = healthDataRepository
                    .findByUserIdOrderByDateDesc(user.getId())
                    .stream()
                    .anyMatch(log -> log.getDate().toLocalDate().isEqual(yesterday));

            if (!hasLog) {
                notificationService.sendNotification(user, "You missed logging your health data yesterday.");
            }
        }
    }

    public List<DailySummaryDTO> getUserDailySummaries(Long userId) {
        List<Object[]> results = healthDataRepository.getDailySummariesByUser(userId);
        return results.stream().map(r -> new DailySummaryDTO(
                ((java.sql.Date) r[0]).toLocalDate(),
                ((Number) r[1]).intValue(),
                ((Number) r[2]).intValue(),
                ((Number) r[3]).doubleValue()
        )).toList();
    }

    private void validateDailyTotals(Long userId, LocalDate date, Long excludeLogId, int newSteps, int newCalories, double newSleepHours) {
        List<Object[]> totalsList;

        if (excludeLogId != null) {
            totalsList = healthDataRepository.findDailyTotalExcludingLog(userId, date, excludeLogId);
        } else {
            totalsList = healthDataRepository.findDailyTotalRaw(userId, date);
        }

        int stepsSoFar = 0;
        int caloriesSoFar = 0;
        double sleepSoFar = 0.0;

        if (!totalsList.isEmpty()) {
            Object[] total = totalsList.get(0);
            if (total[0] != null) stepsSoFar = ((Number) total[0]).intValue();
            if (total[1] != null) caloriesSoFar = ((Number) total[1]).intValue();
            if (total[2] != null) sleepSoFar = ((Number) total[2]).doubleValue();
        }

        if (newSteps < 0 || newCalories < 0 || newSleepHours < 0) {
            throw new RuntimeException("Values cannot be negative.");
        }
        if (stepsSoFar + newSteps > 100000) {
            throw new RuntimeException("Total steps for the day exceed realistic limits.");
        }
        if (caloriesSoFar + newCalories > 10000) {
            throw new RuntimeException("Total calories burned today exceed expected limits.");
        }
        if (sleepSoFar + newSleepHours > 24) {
            throw new RuntimeException("Total sleep hours for the day cannot exceed 24.");
        }
    }
}

