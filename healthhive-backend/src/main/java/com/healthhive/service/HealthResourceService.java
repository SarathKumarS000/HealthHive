package com.healthhive.service;

import com.healthhive.model.HealthResource;
import com.healthhive.repository.HealthResourceRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class HealthResourceService {
    private final HealthResourceRepository repository;

    public HealthResourceService(HealthResourceRepository repository) {
        this.repository = repository;
    }

    public List<HealthResource> getAllResources() {
        return repository.findAll();
    }

    public List<HealthResource> getResourcesByCategory(String category) {
        return repository.findByCategory(category);
    }

    public HealthResource addResource(HealthResource resource) {
        return repository.save(resource);
    }
}
