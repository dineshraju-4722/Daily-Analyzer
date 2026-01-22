package com.application.backend.controller;

import com.application.backend.model.Progress;
import com.application.backend.dto.DailyCompletionDto;
import com.application.backend.service.ProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
@RestController
@RequestMapping("/api/progress")
@CrossOrigin("*")
public class ProgressController {
    @Autowired
    private ProgressService progressService;

    @GetMapping("/stats")
    public ResponseEntity<Progress> getStats() {
        Progress stats = progressService.getStats();
        return ResponseEntity.ok(stats);
    }

    @PostMapping("/update")
    public ResponseEntity<Progress> updateStats() {
        Progress stats = progressService.updateStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/today")
    public ResponseEntity<?> getToday() {
        return ResponseEntity.ok(progressService.getTodayProgress());
    }

    @GetMapping("/history")
    public ResponseEntity<?> getHistory(@RequestParam String startDate, @RequestParam String endDate) {
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        return ResponseEntity.ok(progressService.getProgressHistory(start, end));
    }

    @GetMapping("/completions")
    public ResponseEntity<List<DailyCompletionDto>> getDailyCompletions(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        return ResponseEntity.ok(progressService.getDailyCompletions(start, end));
    }
}
