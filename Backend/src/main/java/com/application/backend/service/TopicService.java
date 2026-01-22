package com.application.backend.service;

import com.application.backend.dto.TopicResponse;
import com.application.backend.model.Topic;
import com.application.backend.repository.TopicRepository;
import com.application.backend.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TopicService {
    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private QuestionRepository questionRepository;

    public List<Topic> getAllTopics() {
        return topicRepository.findAll();
    }

    public List<TopicResponse> getAllTopicsWithCounts() {
        return topicRepository.findAll().stream().map(t ->
                new TopicResponse(
                        t.getId(),
                        t.getName(),
                        t.getDescription(),
                        t.getNotes(),
                        t.getCreatedAt(),
                        t.getUpdatedAt(),
                        questionRepository.countByTopicId(t.getId())
                )
        ).toList();
    }

    public Optional<Topic> getTopicById(Long id) {
        return topicRepository.findById(id);
    }

    public Topic createTopic(Topic topic) {
        return topicRepository.save(topic);
    }

    public Topic updateTopic(Long id, Topic topicDetails) {
        return topicRepository.findById(id).map(topic -> {
            topic.setName(topicDetails.getName());
            topic.setDescription(topicDetails.getDescription());
            topic.setNotes(topicDetails.getNotes());
            return topicRepository.save(topic);
        }).orElseThrow(() -> new RuntimeException("Topic not found"));
    }

    public Topic updateNotes(Long id, String notes) {
        return topicRepository.findById(id).map(topic -> {
            topic.setNotes(notes);
            return topicRepository.save(topic);
        }).orElseThrow(() -> new RuntimeException("Topic not found"));
    }

    public void deleteTopic(Long id) {
        topicRepository.deleteById(id);
    }
}
