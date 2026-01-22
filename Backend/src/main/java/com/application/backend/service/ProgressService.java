package com.application.backend.service;

import com.application.backend.model.Question;
import com.application.backend.model.Progress;
import com.application.backend.model.ProgressHistory;
import com.application.backend.dto.DailyCompletionDto;
import com.application.backend.repository.ProgressRepository;
import com.application.backend.repository.ProgressHistoryRepository;
import com.application.backend.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.ArrayList;

@Service
public class ProgressService {
    @Autowired
    private ProgressRepository progressRepository;

    @Autowired
    private ProgressHistoryRepository progressHistoryRepository;

    @Autowired
    private QuestionRepository questionRepository;

    public Progress getStats() {
        Optional<Progress> progress = progressRepository.findById(1L);
        if (progress.isPresent()) {
            return progress.get();
        }
        return initializeProgress();
    }

    public Progress updateStats() {
        List<Question> allQuestions = questionRepository.findAll();
        
        Progress progress = progressRepository.findById(1L).orElseGet(() -> {
            Progress newProgress = new Progress();
            newProgress.setId(1L);
            return newProgress;
        });

        progress.setTotalQuestions(allQuestions.size());
        progress.setCompletedQuestions((int) allQuestions.stream()
                .filter(q -> q.getStatus() == Question.Status.DONE)
                .count());
        progress.setInProgressQuestions((int) allQuestions.stream()
                .filter(q -> q.getStatus() == Question.Status.IN_PROGRESS)
                .count());
        progress.setTodoQuestions((int) allQuestions.stream()
                .filter(q -> q.getStatus() == Question.Status.TODO)
                .count());

        Progress saved = progressRepository.save(progress);
        
        // Record today's progress in history
        recordDailyProgress(saved);
        
        return saved;
    }

    private void recordDailyProgress(Progress progress) {
        LocalDate today = LocalDate.now();
        ProgressHistory history = progressHistoryRepository.findByDate(today)
                .orElseGet(() -> new ProgressHistory(today));
        
        history.setTotalQuestions(progress.getTotalQuestions());
        history.setCompletedQuestions(progress.getCompletedQuestions());
        history.setInProgressQuestions(progress.getInProgressQuestions());
        history.setTodoQuestions(progress.getTodoQuestions());
        
        progressHistoryRepository.save(history);
    }

    public ProgressHistory getTodayProgress() {
        LocalDate today = LocalDate.now();
        return progressHistoryRepository.findByDate(today)
                .orElseGet(() -> computeAndStoreSnapshot(today));
    }

    public List<ProgressHistory> getProgressHistory(LocalDate startDate, LocalDate endDate) {
        List<ProgressHistory> existing = progressHistoryRepository.findByDateBetweenOrderByDateAsc(startDate, endDate);
        java.util.Map<LocalDate, ProgressHistory> byDate = new java.util.HashMap<>();
        for (ProgressHistory history : existing) {
            byDate.put(history.getDate(), history);
        }

        List<ProgressHistory> filled = new ArrayList<>();
        LocalDate cursor = startDate;
        while (!cursor.isAfter(endDate)) {
            ProgressHistory day = byDate.get(cursor);
            if (day == null) {
                day = new ProgressHistory(cursor);
            }
            filled.add(day);
            cursor = cursor.plusDays(1);
        }
        return filled;
    }

    public List<DailyCompletionDto> getDailyCompletions(LocalDate startDate, LocalDate endDate) {
        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.atTime(23,59,59);
        var rows = questionRepository.countDailyDoneBetween(start, end);

        // Map results by date for quick lookup
        java.util.Map<LocalDate, Long> byDate = new java.util.HashMap<>();
        for (var r : rows) {
            byDate.put(r.getDate(), r.getCount());
        }

        // Fill every date in range with 0 if missing
        List<DailyCompletionDto> result = new ArrayList<>();
        LocalDate cursor = startDate;
        while (!cursor.isAfter(endDate)) {
            result.add(new DailyCompletionDto(cursor, byDate.getOrDefault(cursor, 0L)));
            cursor = cursor.plusDays(1);
        }
        return result;
    }

    private ProgressHistory computeAndStoreSnapshot(LocalDate date) {
        List<Question> allQuestions = questionRepository.findAll();

        int total = allQuestions.size();
        int completed = (int) allQuestions.stream()
                .filter(q -> q.getStatus() == Question.Status.DONE)
                .count();
        int inProgress = (int) allQuestions.stream()
                .filter(q -> q.getStatus() == Question.Status.IN_PROGRESS)
                .count();
        int todo = (int) allQuestions.stream()
                .filter(q -> q.getStatus() == Question.Status.TODO)
                .count();

        Progress progress = progressRepository.findById(1L).orElseGet(() -> {
            Progress newProgress = new Progress();
            newProgress.setId(1L);
            return newProgress;
        });

        progress.setTotalQuestions(total);
        progress.setCompletedQuestions(completed);
        progress.setInProgressQuestions(inProgress);
        progress.setTodoQuestions(todo);
        progressRepository.save(progress);

        ProgressHistory history = new ProgressHistory(date);
        history.setTotalQuestions(total);
        history.setCompletedQuestions(completed);
        history.setInProgressQuestions(inProgress);
        history.setTodoQuestions(todo);

        return progressHistoryRepository.save(history);
    }

    private Progress initializeProgress() {
        Progress progress = new Progress();
        progress.setId(1L);
        progress.setTotalQuestions(0);
        progress.setCompletedQuestions(0);
        progress.setInProgressQuestions(0);
        progress.setTodoQuestions(0);
        return progressRepository.save(progress);
    }
}
