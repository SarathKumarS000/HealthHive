package com.healthhive.controller;

import com.healthhive.model.HealthResource;
import com.healthhive.service.HealthResourceService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/resources")
public class HealthResourceController {
    private final HealthResourceService service;

    public HealthResourceController(HealthResourceService service) {
        this.service = service;
    }

    @GetMapping
    public List<HealthResource> getAllResources() {
        return service.getAllResources();
    }

    @GetMapping("/{category}")
    public List<HealthResource> getResourcesByCategory(@PathVariable String category) {
        return service.getResourcesByCategory(category);
    }

    @PostMapping
    public HealthResource addResource(@RequestBody HealthResource resource) {
        return service.addResource(resource);
    }
}
