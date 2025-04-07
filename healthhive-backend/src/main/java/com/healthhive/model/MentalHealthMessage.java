package com.healthhive.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class MentalHealthMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 255)
    @jakarta.validation.constraints.Size(max = 255, message = "Message must be at most 255 characters.")
    private String content;

    private LocalDateTime timestamp = LocalDateTime.now();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
