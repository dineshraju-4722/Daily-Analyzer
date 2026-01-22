package com.application.backend.controller;

import com.application.backend.dto.TopicResponse;
import com.application.backend.model.Topic;
import com.application.backend.model.Question;
import com.application.backend.service.TopicService;
import com.application.backend.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/topics")
@CrossOrigin(origins = "http://localhost:5173")
public class TopicController {
    @Autowired
    private TopicService topicService;

    @Autowired
    private QuestionService questionService;

    @GetMapping
    public ResponseEntity<List<TopicResponse>> getAllTopics() {
        return ResponseEntity.ok(topicService.getAllTopicsWithCounts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Topic> getTopicById(@PathVariable Long id) {
        return topicService.getTopicById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Topic> createTopic(@RequestBody Topic topic) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(topicService.createTopic(topic));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Topic> updateTopic(@PathVariable Long id, @RequestBody Topic topic) {
        return ResponseEntity.ok(topicService.updateTopic(id, topic));
    }

    @PutMapping("/{id}/notes")
    public ResponseEntity<Topic> updateTopicNotes(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String notes = body.get("notes");
        return ResponseEntity.ok(topicService.updateNotes(id, notes));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTopic(@PathVariable Long id) {
        topicService.deleteTopic(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/questions")
    public ResponseEntity<List<Question>> getQuestionsByTopic(@PathVariable Long id) {
        return ResponseEntity.ok(questionService.getQuestionsByTopic(id));
    }
}
