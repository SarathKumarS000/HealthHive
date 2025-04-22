package com.healthhive.service;

import com.healthhive.model.Appointment;
import com.healthhive.model.HealthResource;
import com.healthhive.repository.AppointmentRepository;
import com.healthhive.repository.HealthResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class AppointmentService {
    private final AppointmentRepository repository;
    private final NotificationService notificationService;
    private final HealthResourceRepository resourceRepository;

    @Autowired
    public AppointmentService(AppointmentRepository repository, NotificationService notificationService, HealthResourceRepository resourceRepository) {
        this.repository = repository;
        this.notificationService = notificationService;
        this.resourceRepository = resourceRepository;
    }

    public List<Appointment> getUserAppointments(Long userId) {
        return repository.findByUserId(userId);
    }

    public Appointment bookAppointment(Appointment appointment) {
        if (appointment.getResource() != null && appointment.getResource().getId() != null) {
            HealthResource resource = resourceRepository.findById(appointment.getResource().getId())
                    .orElseThrow(() -> new RuntimeException("Resource not found"));
            appointment.setResource(resource);
        }

        Appointment savedAppointment = repository.save(appointment);

        String resourceName = (savedAppointment.getResource() != null)
                ? savedAppointment.getResource().getName()
                : "No specific resource";

        String formattedDate = savedAppointment.getAppointmentTime()
                .format(DateTimeFormatter.ofPattern("MMM d, yyyy 'at' hh:mm a"));

        notificationService.sendNotification(
                savedAppointment.getUser(),
                "Your appointment has been successfully booked for " + formattedDate +
                        " with resource: " + resourceName + "."
        );

        return savedAppointment;
    }

}

