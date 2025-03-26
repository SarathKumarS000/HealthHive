package com.healthhive.repository;

import com.healthhive.model.HealthResource;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HealthResourceRepository extends JpaRepository<HealthResource, Long> {
    List<HealthResource> findByCategory(String category);
}
