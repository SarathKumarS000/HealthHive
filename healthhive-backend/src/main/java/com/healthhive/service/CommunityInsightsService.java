package com.healthhive.service;

import com.healthhive.model.HealthData;
import com.healthhive.repository.HealthDataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommunityInsightsService {

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
}
