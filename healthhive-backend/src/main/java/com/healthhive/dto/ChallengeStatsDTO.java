package com.healthhive.dto;

public class ChallengeStatsDTO {
    private int totalParticipants;
    private int completedParticipants;

    public int getTotalParticipants() {
        return totalParticipants;
    }

    public void setTotalParticipants(int totalParticipants) {
        this.totalParticipants = totalParticipants;
    }

    public int getCompletedParticipants() {
        return completedParticipants;
    }

    public void setCompletedParticipants(int completedParticipants) {
        this.completedParticipants = completedParticipants;
    }
}

