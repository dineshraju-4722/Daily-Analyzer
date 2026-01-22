package com.application.backend.controller;

import com.application.backend.model.Question;
import com.application.backend.model.Topic;
import com.application.backend.dto.QuestionRequest;
import com.application.backend.service.QuestionService;
import com.application.backend.service.TopicService;
import com.application.backend.service.ProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "http://localhost:5173")
public class QuestionController {
    @Autowired
    private QuestionService questionService;

    @Autowired
    private ProgressService progressService;

    @Autowired
    private TopicService topicService;

    @GetMapping
    public ResponseEntity<List<Question>> getAllQuestions() {
        return ResponseEntity.ok(questionService.getAllQuestions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Question> getQuestionById(@PathVariable Long id) {
        return questionService.getQuestionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/topic/{topicId}")
    public ResponseEntity<List<Question>> getQuestionsByTopic(@PathVariable Long topicId) {
        return ResponseEntity.ok(questionService.getQuestionsByTopic(topicId));
    }

    @PostMapping
    public ResponseEntity<Question> createQuestion(@RequestBody QuestionRequest request) {
        Question savedQuestion = questionService.createQuestion(mapToQuestion(request, null));
        progressService.updateStats();
        return ResponseEntity.status(HttpStatus.CREATED).body(savedQuestion);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Question> updateQuestion(@PathVariable Long id, @RequestBody QuestionRequest request) {
        Question existing = questionService.getQuestionById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        Question updatedQuestion = questionService.updateQuestion(id, mapToQuestion(request, existing));
        progressService.updateStats();
        return ResponseEntity.ok(updatedQuestion);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Question> updateStatus(@PathVariable Long id, @RequestBody QuestionRequest request) {
        Question question = questionService.getQuestionById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        if (request.getStatus() != null) {
            question.setStatus(request.getStatus());
        }
        Question saved = questionService.updateQuestion(id, question);
        progressService.updateStats();
        return ResponseEntity.ok(saved);
    }

    @PatchMapping("/{id}/important")
    public ResponseEntity<Question> toggleImportant(@PathVariable Long id) {
        Question question = questionService.getQuestionById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        question.setIsImportant(!Boolean.TRUE.equals(question.getIsImportant()));
        Question saved = questionService.updateQuestion(id, question);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{id}/reminders")
    public ResponseEntity<Question> getQuestionReminder(@PathVariable Long id) {
        return questionService.getQuestionById(id)
                .filter(q -> q.getReminderDateTime() != null)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/recent/completed")
    public ResponseEntity<List<Question>> getRecentCompleted(@RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(questionService.getRecentCompleted(limit));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
        progressService.updateStats();
        return ResponseEntity.noContent().build();
    }

    private Question mapToQuestion(QuestionRequest request, Question existing) {
        Question question = existing != null ? existing : new Question();
        if (request.getTopicId() != null) {
            Topic topic = topicService.getTopicById(request.getTopicId())
                    .orElseThrow(() -> new RuntimeException("Topic not found"));
            question.setTopic(topic);
        }
        question.setLeetcodeNumber(request.getLeetcodeNumber());
        question.setTitle(request.getTitle());
        question.setLink(request.getLink());
        if (request.getDifficulty() != null) {
            question.setDifficulty(request.getDifficulty());
        }
        if (request.getStatus() != null) {
            question.setStatus(request.getStatus());
        }
        question.setIsImportant(request.getIsImportant());
        
        // Parse datetime string to LocalDateTime
        if (request.getReminderDateTime() != null && !request.getReminderDateTime().isEmpty()) {
            try {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm");
                question.setReminderDateTime(LocalDateTime.parse(request.getReminderDateTime(), formatter));
            } catch (Exception e) {
                question.setReminderDateTime(null);
            }
        } else {
            question.setReminderDateTime(null);
        }
        
        return question;
    }
}
