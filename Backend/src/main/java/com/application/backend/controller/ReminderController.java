package com.application.backend.controller;

import com.application.backend.model.Question;
import com.application.backend.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reminders")
@CrossOrigin("*")
public class ReminderController {
    @Autowired
    private QuestionService questionService;

    @GetMapping
    public ResponseEntity<List<Question>> getAllReminders() {
        List<Question> reminders = questionService.getAllQuestions().stream()
                .filter(q -> q.getReminderDateTime() != null)
                .collect(Collectors.toList());
        return ResponseEntity.ok(reminders);
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<Question>> getUpcomingReminders() {
        LocalDateTime now = LocalDateTime.now();
        List<Question> upcomingReminders = questionService.getAllQuestions().stream()
                .filter(q -> q.getReminderDateTime() != null && q.getReminderDateTime().isAfter(now))
                .sorted((q1, q2) -> q1.getReminderDateTime().compareTo(q2.getReminderDateTime()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(upcomingReminders);
    }
}
