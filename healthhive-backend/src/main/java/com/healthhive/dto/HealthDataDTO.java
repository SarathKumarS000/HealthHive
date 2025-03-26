package com.healthhive.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HealthDataDTO {
    private Long userId;
    private int steps;
    private int calories;
    private double weight;
    private int sleepHours;
    private String mood;
}
