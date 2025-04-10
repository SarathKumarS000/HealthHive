package com.healthhive.dto;

import java.time.LocalDate;

public class DailySummaryDTO {
    private LocalDate date;
    private int totalSteps;
    private int totalCalories;
    private double totalSleepHours;

    public DailySummaryDTO(LocalDate date, int totalSteps, int totalCalories, double totalSleepHours) {
        this.date = date;
        this.totalSteps = totalSteps;
        this.totalCalories = totalCalories;
        this.totalSleepHours = totalSleepHours;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public int getTotalSteps() {
        return totalSteps;
    }

    public void setTotalSteps(int totalSteps) {
        this.totalSteps = totalSteps;
    }

    public int getTotalCalories() {
        return totalCalories;
    }

    public void setTotalCalories(int totalCalories) {
        this.totalCalories = totalCalories;
    }

    public double getTotalSleepHours() {
        return totalSleepHours;
    }

    public void setTotalSleepHours(double totalSleepHours) {
        this.totalSleepHours = totalSleepHours;
    }
}


