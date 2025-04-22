package com.healthhive.service;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DailyHealthCheckScheduler {

    private final HealthService healthService;

    // Run every day at 9 AM
    @Scheduled(cron = "0 0 9 * * *")
    public void checkMissedHealthLogs() {
        healthService.checkAndNotifyMissedLogs();
    }
}
