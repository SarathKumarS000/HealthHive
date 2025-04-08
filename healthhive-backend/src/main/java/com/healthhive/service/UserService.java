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

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public User registerUser(RegisterRequest userDTO) {
        if (userRepository.findByEmail(userDTO.getEmail()).isPresent() || userRepository.findByUsername(userDTO.getUsername()).isPresent()) {
            throw new RuntimeException("User already exists!");
        }
        if (!isStrongPassword(userDTO.getPassword())) {
            throw new RuntimeException("Password must be at least 8 characters, include uppercase, lowercase, a number, and a special character.");
        }

        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setEmail(userDTO.getEmail());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));

        return userRepository.save(user);
    }

    private boolean isStrongPassword(String password) {
        return password.matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$");
    }
}
