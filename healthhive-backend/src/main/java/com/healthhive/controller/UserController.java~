package com.healthhive.controller;

import com.healthhive.dto.RegisterRequest;
import com.healthhive.model.User;
import com.healthhive.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody RegisterRequest userDTO) {
        User newUser = userService.registerUser(userDTO);
        return ResponseEntity.ok(newUser);
    }
}
