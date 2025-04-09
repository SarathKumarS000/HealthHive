package com.healthhive.repository;

import com.healthhive.model.VolunteerOpportunity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VolunteerOpportunityRepository extends JpaRepository<VolunteerOpportunity, Long> {
    @Query("SELECT v FROM VolunteerOpportunity v JOIN v.joinedUsers u WHERE u.id = :userId")
    List<VolunteerOpportunity> findByJoinedUserId(@Param("userId") Long userId);
}

