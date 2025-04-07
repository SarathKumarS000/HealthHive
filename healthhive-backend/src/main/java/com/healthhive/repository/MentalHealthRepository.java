package com.healthhive.repository;

import com.healthhive.model.MentalHealthMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MentalHealthRepository extends JpaRepository<MentalHealthMessage, Long> {
}
