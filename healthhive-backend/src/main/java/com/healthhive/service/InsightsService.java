package com.healthhive.service;

import com.healthhive.dto.BestDayDTO;
import com.healthhive.dto.DailySummaryDTO;
import com.healthhive.dto.PersonalInsightsDTO;
import com.healthhive.model.HealthData;
import com.healthhive.repository.HealthDataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InsightsService {

    private final HealthDataRepository healthDataRepository;

    public Map<String, Object> getAggregatedData() {
        List<HealthData> allData = healthDataRepository.findAll();

        double avgSteps = allData.stream().mapToInt(HealthData::getSteps).average().orElse(0);
        double avgSleep = allData.stream().mapToDouble(HealthData::getSleepHours).average().orElse(0);
        double avgCalories = allData.stream()
                .mapToDouble(h -> h.getCalories() == 0 ? 0.0 : h.getCalories()) // Avoid division by zero
                .average()
                .orElse(0);

        Map<String, Long> moodCounts = allData.stream()
                .filter(h -> Objects.nonNull(h.getMood()))
                .collect(Collectors.groupingBy(HealthData::getMood, Collectors.counting()));

        Optional<Map.Entry<String, Long>> mostCommonMoodEntry = moodCounts.entrySet()
                .stream()
                .max(Map.Entry.comparingByValue());

        String mostCommonMood = mostCommonMoodEntry.map(Map.Entry::getKey).orElse("");

        Map<String, Object> insights = new HashMap<>();
        insights.put("average_steps", avgSteps);
        insights.put("average_sleep", avgSleep);
        insights.put("average_calories", avgCalories);
        insights.put("mood_counts", moodCounts);
        insights.put("most_common_mood", mostCommonMood);

        return insights;
    }

    public PersonalInsightsDTO getPersonalInsights(Long userId) {
        List<HealthData> logs = healthDataRepository.findByUserIdOrderByDateAsc(userId);

        if (logs.isEmpty()) return new PersonalInsightsDTO();

        double avgSteps = logs.stream().mapToInt(HealthData::getSteps).average().orElse(0);
        double avgCalories = logs.stream().mapToInt(HealthData::getCalories).average().orElse(0);
        double avgSleep = logs.stream().mapToDouble(HealthData::getSleepHours).average().orElse(0);

        Map<String, Long> moodCounts = logs.stream()
                .filter(log -> log.getMood() != null)
                .collect(Collectors.groupingBy(HealthData::getMood, Collectors.counting()));

        String mostCommonMood = moodCounts.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(null);

        // Best day
        Map<LocalDate, List<HealthData>> groupedByDay = logs.stream()
                .collect(Collectors.groupingBy(log -> log.getDate().toLocalDate()));

        BestDayDTO best = groupedByDay.entrySet().stream()
                .map(entry -> {
                    int steps = entry.getValue().stream().mapToInt(HealthData::getSteps).sum();
                    int calories = entry.getValue().stream().mapToInt(HealthData::getCalories).sum();
                    double sleep = entry.getValue().stream().mapToDouble(HealthData::getSleepHours).sum();
                    return new BestDayDTO(entry.getKey(), steps, calories, sleep);
                })
                .max(Comparator.comparingInt(BestDayDTO::getSteps))
                .orElse(null);

        List<DailySummaryDTO> summaries = healthDataRepository.getDailySummariesByUser(userId).stream()
                .map(arr -> new DailySummaryDTO(
                        ((java.sql.Date) arr[0]).toLocalDate(),
                        ((Number) arr[1]).intValue(),
                        ((Number) arr[2]).intValue(),
                        ((Number) arr[3]).doubleValue()
                ))
                .toList();

        return new PersonalInsightsDTO(avgSteps, avgCalories, avgSleep, mostCommonMood, moodCounts, best, summaries);
    }
}
