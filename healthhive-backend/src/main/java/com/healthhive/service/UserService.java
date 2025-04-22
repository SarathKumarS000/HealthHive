package com.healthhive.service;

import com.healthhive.dto.RegisterRequest;
import com.healthhive.model.User;
import com.healthhive.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final NotificationService notificationService;

    public UserService(UserRepository userRepository, NotificationService notificationService) {
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public User registerUser(RegisterRequest userDTO) {
        if (userRepository.findByEmail(userDTO.getEmail()).isPresent() || userRepository.findByUsername(userDTO.getUsername()).isPresent()) {
            throw new RuntimeException("User already exists!");
        }
        if (!isStrongPassword(userDTO.getPassword())) {
            throw new RuntimeException("Password must be at least 8 characters, include uppercase, lowercase, a number, and a special character.");
        }
        if (userDTO.getFullName() == null || userDTO.getFullName().isEmpty()) {
            throw new RuntimeException("Full name cannot be empty.");
        }

        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setEmail(userDTO.getEmail());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setFullName(userDTO.getFullName());

        User savedUser = userRepository.save(user);

        notificationService.sendNotification(savedUser, "Welcome to HealthHive, " + user.getFullName() + "! 🎉");

        return savedUser;
    }

    private boolean isStrongPassword(String password) {
        return password.matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$");
    }
}
