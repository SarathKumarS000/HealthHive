package com.healthhive.dto;

import java.time.LocalDate;

public class DailyTotalDTO {
    private LocalDate date;
    private int totalSteps;
    private int totalCalories;
    private double totalSleepHours;

    public DailyTotalDTO(LocalDate date, int steps, int calories, double sleepHours) {
        this.date = date;
        this.totalSteps = steps;
        this.totalCalories = calories;
        this.totalSleepHours = sleepHours;
    }

    public LocalDate getDate() {
        return date;
    }

    public int getTotalSteps() {
        return totalSteps;
    }

    public int getTotalCalories() {
        return totalCalories;
    }

    public double getTotalSleepHours() {
        return totalSleepHours;
    }
}
