package com.application.backend.service;

import com.application.backend.model.Question;
import com.application.backend.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Optional;

@Service
public class QuestionService {
    @Autowired
    private QuestionRepository questionRepository;

    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    public Optional<Question> getQuestionById(Long id) {
        return questionRepository.findById(id);
    }

    public List<Question> getQuestionsByTopic(Long topicId) {
        return questionRepository.findByTopicId(topicId);
    }

    public Question createQuestion(Question question) {
        return questionRepository.save(question);
    }

    public List<Question> getRecentCompleted(int limit) {
        return questionRepository.findByStatusOrderByUpdatedAtDesc(
                Question.Status.DONE,
                PageRequest.of(0, limit)
        );
    }

    public Question updateQuestion(Long id, Question questionDetails) {
        return questionRepository.findById(id).map(question -> {
            question.setTopic(questionDetails.getTopic());
            question.setLeetcodeNumber(questionDetails.getLeetcodeNumber());
            question.setTitle(questionDetails.getTitle());
            question.setLink(questionDetails.getLink());
            question.setDifficulty(questionDetails.getDifficulty());
            question.setStatus(questionDetails.getStatus());
            question.setIsImportant(questionDetails.getIsImportant());
            question.setReminderDateTime(questionDetails.getReminderDateTime());
            return questionRepository.save(question);
        }).orElseThrow(() -> new RuntimeException("Question not found"));
    }

    public void deleteQuestion(Long id) {
        questionRepository.deleteById(id);
    }
}
