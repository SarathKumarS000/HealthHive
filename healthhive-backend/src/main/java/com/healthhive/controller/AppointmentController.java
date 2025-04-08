package com.healthhive.controller;

import com.healthhive.model.Appointment;
import com.healthhive.service.AppointmentService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {
    private final AppointmentService service;

    public AppointmentController(AppointmentService service) {
        this.service = service;
    }

    @GetMapping("/{userId}")
    public List<Appointment> getUserAppointments(@PathVariable Long userId) {
        return service.getUserAppointments(userId);
    }

    @PostMapping
    public Appointment bookAppointment(@RequestBody Appointment appointment) {
        return service.bookAppointment(appointment);
    }
}
