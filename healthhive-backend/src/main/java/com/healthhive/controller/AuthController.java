package com.healthhive.controller;

import com.healthhive.dto.AuthRequest;
import com.healthhive.dto.AuthResponse;
import com.healthhive.model.User;
import com.healthhive.service.AuthService;
import com.healthhive.service.CustomUserDetailsService;
import com.healthhive.util.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtService;
    private final CustomUserDetailsService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request, HttpServletResponse response) {
        AuthResponse authResponse = authService.authenticate(request);

        // Create a secure HttpOnly cookie with the token
        Cookie jwtCookie = new Cookie("jwt", authResponse.getToken());
        jwtCookie.setHttpOnly(true);
        jwtCookie.setSecure(true); // Use true in production (requires HTTPS)
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(24 * 60 * 60); // 1 day

        response.addCookie(jwtCookie);

        // Optionally, avoid sending the token in body
        return ResponseEntity.ok(authResponse.getUser());
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        Cookie jwtCookie = new Cookie("jwt", null);
        jwtCookie.setHttpOnly(true);
        jwtCookie.setSecure(true);
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(0); // Expire immediately
        response.addCookie(jwtCookie);

        return ResponseEntity.ok("Logged out successfully.");
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@CookieValue(name = "jwt", required = false) String token) {
        if (token == null || token.isEmpty()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        try {
            String username = jwtService.extractUsername(token);
            User user = userService.getUserByUsername(username);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid token");
        }
    }
}
