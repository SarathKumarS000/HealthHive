package com.healthhive.repository;

import com.healthhive.model.HealthData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface HealthDataRepository extends JpaRepository<HealthData, Long> {
    List<HealthData> findByUserIdOrderByDateDesc(Long userId);

    List<HealthData> findByUserIdOrderByDateAsc(Long userId);

    @Query("SELECT SUM(h.steps) FROM HealthData h WHERE h.user.id = :userId AND h.date BETWEEN :start AND :end")
    Integer sumStepsBetween(Long userId, LocalDateTime start, LocalDateTime end);

    @Query("SELECT SUM(h.calories) FROM HealthData h WHERE h.user.id = :userId AND h.date BETWEEN :start AND :end")
    Integer sumCaloriesBetween(Long userId, LocalDateTime start, LocalDateTime end);

    @Query("""
        SELECT 
            CASE 
                WHEN :goalType = 'steps' THEN SUM(h.steps)
                WHEN :goalType = 'calories' THEN SUM(h.calories)
                ELSE 0 
            END
        FROM HealthData h 
        WHERE h.user.id = :userId 
          AND h.date BETWEEN :startDate AND :endDate
    """)
    Integer sumByUserAndGoalTypeBetweenDates(
            @Param("userId") Long userId,
            @Param("goalType") String goalType,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    @Query(value = """
    SELECT 
      DATE(h.date) as date, 
      COALESCE(SUM(h.steps), 0) as totalSteps, 
      COALESCE(SUM(h.calories), 0) as totalCalories, 
      COALESCE(SUM(h.sleep_hours), 0) as totalSleepHours
    FROM health_data h 
    WHERE h.user_id = :userId 
    GROUP BY DATE(h.date) 
    ORDER BY DATE(h.date)
    """, nativeQuery = true)
    List<Object[]> getDailySummariesByUser(@Param("userId") Long userId);

    @Query("""
    SELECT SUM(h.steps), SUM(h.calories), SUM(h.sleepHours)
    FROM HealthData h
    WHERE h.user.id = :userId AND FUNCTION('DATE', h.date) = :date
    """)
    List<Object[]> findDailyTotalRaw(@Param("userId") Long userId, @Param("date") LocalDate date);

    @Query("""
    SELECT SUM(h.steps), SUM(h.calories), SUM(h.sleepHours)
    FROM HealthData h
    WHERE h.user.id = :userId AND FUNCTION('DATE', h.date) = :date AND h.id <> :logId
    """)
    List<Object[]> findDailyTotalExcludingLog(@Param("userId") Long userId, @Param("date") LocalDate date, @Param("logId") Long logId);
}
