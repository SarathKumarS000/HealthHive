package com.healthhive.repository;

import com.healthhive.model.HealthChallenge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HealthChallengeRepository extends JpaRepository<HealthChallenge, Long> {
    List<HealthChallenge> findByParticipants_Id(Long userId);

    @Query("SELECT c FROM HealthChallenge c JOIN c.participants p WHERE p.id = :userId")
    List<HealthChallenge> findByUserId(Long userId);
}


