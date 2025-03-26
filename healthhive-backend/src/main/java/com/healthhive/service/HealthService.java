package com.healthhive.service;

import com.healthhive.dto.HealthDataDTO;
import com.healthhive.model.HealthData;
import com.healthhive.model.User;
import com.healthhive.repository.HealthDataRepository;
import com.healthhive.repository.UserRepository;
import lombok.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HealthService {

    private final HealthDataRepository healthDataRepository;
    private final UserRepository userRepository;

    public void logHealthData(HealthDataDTO dto) {
        User user = userRepository.findById(dto.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));
        HealthData healthData = new HealthData(null, user, dto.getSteps(), dto.getCalories(), dto.getWeight(), dto.getSleepHours(), dto.getMood());
        healthDataRepository.save(healthData);
    }

    public List<HealthData> getUserHealthData(Long userId) {
        return healthDataRepository.findByUserId(userId);
    }
}

