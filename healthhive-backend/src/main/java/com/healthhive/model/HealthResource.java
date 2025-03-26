package com.healthhive.model;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "health_resources")
public class HealthResource {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String address;
    private String contact;

    @Column(nullable = false)
    private String category; // "Clinic", "Hospital", "Mental Health", "Fitness Center"

    @Column(columnDefinition = "TEXT")
    private String services; // Comma-separated values like "Vaccination, Mental Health Counseling, Check-ups"

    private boolean appointmentAvailable; // Can users book appointments?
}
