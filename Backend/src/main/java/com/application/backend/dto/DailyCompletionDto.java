package com.application.backend.dto;

import java.time.LocalDate;

public class DailyCompletionDto {
    private LocalDate date;
    private long completed;

    public DailyCompletionDto() {}

    public DailyCompletionDto(LocalDate date, long completed) {
        this.date = date;
        this.completed = completed;
    }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public long getCompleted() { return completed; }
    public void setCompleted(long completed) { this.completed = completed; }
}
