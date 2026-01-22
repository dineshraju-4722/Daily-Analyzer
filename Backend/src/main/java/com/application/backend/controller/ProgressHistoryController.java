package com.application.backend.controller;

import com.application.backend.model.ProgressHistory;
import com.application.backend.service.ProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/progress-history")
@CrossOrigin(origins = "http://localhost:5173")
public class ProgressHistoryController {
    
    @Autowired
    private ProgressService progressService;

    // Kept only for any legacy callers; path changed to avoid conflicts.
    @GetMapping("/today")
    public ProgressHistory getTodayProgress() {
        return progressService.getTodayProgress();
    }

    @GetMapping("/history")
    public List<ProgressHistory> getProgressHistory(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        LocalDate start = startDate != null ? LocalDate.parse(startDate) : LocalDate.now().minusDays(6);
        LocalDate end = endDate != null ? LocalDate.parse(endDate) : LocalDate.now();
        return progressService.getProgressHistory(start, end);
    }
}
