package com.healthhive.service;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DailyHealthCheckScheduler {

    private final HealthService healthService;

    // Run every day at 10 AM
    @Scheduled(cron = "0 0 10 * * *")
    public void checkMissedHealthLogs() {
        healthService.checkAndNotifyMissedLogs();
    }
}
