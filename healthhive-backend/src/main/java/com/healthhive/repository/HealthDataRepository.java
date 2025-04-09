package com.healthhive.repository;

import com.healthhive.model.HealthData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface HealthDataRepository extends JpaRepository<HealthData, Long> {
    List<HealthData> findByUserIdOrderByDateAsc(Long userId);

    @Query("SELECT SUM(h.steps) FROM HealthData h WHERE h.user.id = :userId AND h.date BETWEEN :start AND :end")
    Integer sumStepsBetween(Long userId, LocalDateTime start, LocalDateTime end);

    @Query("SELECT SUM(h.calories) FROM HealthData h WHERE h.user.id = :userId AND h.date BETWEEN :start AND :end")
    Integer sumCaloriesBetween(Long userId, LocalDateTime start, LocalDateTime end);

}
