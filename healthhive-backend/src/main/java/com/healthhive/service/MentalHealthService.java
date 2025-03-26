package com.healthhive.service;

import com.healthhive.dto.MentalHealthDTO;
import com.healthhive.model.MentalHealthLog;
import com.healthhive.model.User;
import com.healthhive.repository.MentalHealthRepository;
import com.healthhive.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class MentalHealthService {

    private final MentalHealthRepository mentalHealthRepository;
    private final UserRepository userRepository;

    public void logCheckIn(MentalHealthDTO dto) {
        User user = userRepository.findById(dto.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));
        MentalHealthLog log = new MentalHealthLog(null, user, dto.getMood(), dto.getStressLevel(), dto.getNotes(), LocalDateTime.now());
        mentalHealthRepository.save(log);
    }
}
