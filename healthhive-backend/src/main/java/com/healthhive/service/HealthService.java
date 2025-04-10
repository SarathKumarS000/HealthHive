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
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@Service
@RequiredArgsConstructor
public class HealthService {

    private final HealthDataRepository healthDataRepository;
    private final UserRepository userRepository;
    private static final Logger logger = LoggerFactory.getLogger(HealthService.class);

    public void logHealthData(HealthDataDTO dto) {
        logger.info("Attempting to log health data: {}", dto);

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        logger.debug("User found: {}", user.getUsername());

        List<Object[]> totalsList = healthDataRepository.findDailyTotalRaw(user.getId(), LocalDate.now());
        Object[] total = totalsList.isEmpty() ? null : totalsList.get(0);
        logger.info("Today's totals before logging - Steps: {}, Calories: {}, Sleep: {}", total[0], total[1], total[2]);

        int stepsSoFar = 0;
        int caloriesSoFar = 0;
        double sleepSoFar = 0.0;

        if (total != null) {
            if (total[0] != null) stepsSoFar = ((Number) total[0]).intValue();
            if (total[1] != null) caloriesSoFar = ((Number) total[1]).intValue();
            if (total[2] != null) sleepSoFar = ((Number) total[2]).doubleValue();
        }

        logger.info("Today's totals before logging - Steps: {}, Calories: {}, Sleep: {}", stepsSoFar, caloriesSoFar, sleepSoFar);

        // Input validation
        if (dto.getSteps() < 0 || dto.getCalories() < 0 || dto.getSleepHours() < 0) {
            logger.warn("Negative values detected in input: {}", dto);
            throw new RuntimeException("Values cannot be negative.");
        }

        if (sleepSoFar + dto.getSleepHours() > 24) {
            logger.info("Attempted to log sleep that exceeds 24 hours: Already {} hrs, New {} hrs", sleepSoFar, dto.getSleepHours());
            throw new RuntimeException("Total sleep hours for the day cannot exceed 24.");
        }

        HealthData healthData = new HealthData(
                null,
                user,
                dto.getSteps(),
                dto.getCalories(),
                dto.getWeight(),
                dto.getSleepHours(),
                dto.getMood(),
                LocalDateTime.now()
        );

        logger.info("Saving new health log: {}", healthData);
        healthDataRepository.save(healthData);
        logger.info("Health data logged successfully for user {}", user.getUsername());
    }
    public List<HealthData> getUserHealthData(Long userId) {
        return healthDataRepository.findByUserIdOrderByDateDesc(userId);
    }

    public HealthData updateLog(Long id, HealthData updatedLog) {
        HealthData log = healthDataRepository.findById(id).orElseThrow();
        log.setSteps(updatedLog.getSteps());
        log.setCalories(updatedLog.getCalories());
        log.setSleepHours(updatedLog.getSleepHours());
        log.setMood(updatedLog.getMood());
        log.setDate(LocalDateTime.now());
        return healthDataRepository.save(log);
    }

    public void deleteLog(Long id) {
        healthDataRepository.deleteById(id);
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
}

