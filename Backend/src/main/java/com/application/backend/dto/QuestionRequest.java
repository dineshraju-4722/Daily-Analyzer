package com.application.backend.dto;

import com.application.backend.model.Question;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

public class QuestionRequest {
    private Long topicId;
    private Long leetcodeNumber;
    private String title;
    private String link;
    private Question.Difficulty difficulty;
    private Question.Status status;
    private Boolean isImportant;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private String reminderDateTime;

    public Long getTopicId() { return topicId; }
    public void setTopicId(Long topicId) { this.topicId = topicId; }

    public Long getLeetcodeNumber() { return leetcodeNumber; }
    public void setLeetcodeNumber(Long leetcodeNumber) { this.leetcodeNumber = leetcodeNumber; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getLink() { return link; }
    public void setLink(String link) { this.link = link; }

    public Question.Difficulty getDifficulty() { return difficulty; }
    public void setDifficulty(Question.Difficulty difficulty) { this.difficulty = difficulty; }

    public Question.Status getStatus() { return status; }
    public void setStatus(Question.Status status) { this.status = status; }

    public Boolean getIsImportant() { return isImportant; }
    public void setIsImportant(Boolean isImportant) { this.isImportant = isImportant; }

    public String getReminderDateTime() { return reminderDateTime; }
    public void setReminderDateTime(String reminderDateTime) { this.reminderDateTime = reminderDateTime; }
}
