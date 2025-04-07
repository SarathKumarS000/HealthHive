package com.healthhive.repository;

import com.healthhive.model.MentalHealthMessage;
import com.healthhive.model.Reaction;
import com.healthhive.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReactionRepository extends JpaRepository<Reaction, Long> {
    Optional<Reaction> findByUserAndMessage(User user, MentalHealthMessage message);
    List<Reaction> findByMessage(MentalHealthMessage message);
}

