package com.healthhive.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PersonalInsightsDTO {
    private double averageSteps;
    private double averageCalories;
    private double averageSleepHours;
    private String mostCommonMood;
    private Map<String, Long> moodCounts;
    private BestDayDTO bestDay;
    private List<DailySummaryDTO> dailySummaries;

    public double getAverageSteps() {
        return averageSteps;
    }

    public void setAverageSteps(double averageSteps) {
        this.averageSteps = averageSteps;
    }

    public double getAverageCalories() {
        return averageCalories;
    }

    public void setAverageCalories(double averageCalories) {
        this.averageCalories = averageCalories;
    }

    public double getAverageSleepHours() {
        return averageSleepHours;
    }

    public void setAverageSleepHours(double averageSleepHours) {
        this.averageSleepHours = averageSleepHours;
    }

    public String getMostCommonMood() {
        return mostCommonMood;
    }

    public void setMostCommonMood(String mostCommonMood) {
        this.mostCommonMood = mostCommonMood;
    }

    public Map<String, Long> getMoodCounts() {
        return moodCounts;
    }

    public void setMoodCounts(Map<String, Long> moodCounts) {
        this.moodCounts = moodCounts;
    }

    public BestDayDTO getBestDay() {
        return bestDay;
    }

    public void setBestDay(BestDayDTO bestDay) {
        this.bestDay = bestDay;
    }

    public List<DailySummaryDTO> getDailySummaries() {
        return dailySummaries;
    }

    public void setDailySummaries(List<DailySummaryDTO> dailySummaries) {
        this.dailySummaries = dailySummaries;
    }
}
