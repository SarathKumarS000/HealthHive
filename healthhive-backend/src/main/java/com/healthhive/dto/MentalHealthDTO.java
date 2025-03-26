package com.healthhive.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MentalHealthDTO {
    private Long userId;
    private String mood;
    private String stressLevel;
    private String notes;
}

