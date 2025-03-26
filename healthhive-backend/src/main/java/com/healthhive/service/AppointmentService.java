package com.healthhive.service;

import com.healthhive.model.Appointment;
import com.healthhive.repository.AppointmentRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AppointmentService {
    private final AppointmentRepository repository;

    public AppointmentService(AppointmentRepository repository) {
        this.repository = repository;
    }

    public List<Appointment> getUserAppointments(Long userId) {
        return repository.findByUserId(userId);
    }

    public Appointment bookAppointment(Appointment appointment) {
        return repository.save(appointment);
    }
}

