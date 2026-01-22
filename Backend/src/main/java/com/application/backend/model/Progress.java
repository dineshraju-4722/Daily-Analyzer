package com.application.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "progress")
public class Progress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "total_questions")
    private Integer totalQuestions = 0;

    @Column(name = "completed_questions")
    private Integer completedQuestions = 0;

    @Column(name = "in_progress_questions")
    private Integer inProgressQuestions = 0;

    @Column(name = "todo_questions")
    private Integer todoQuestions = 0;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(Integer totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public Integer getCompletedQuestions() {
        return completedQuestions;
    }

    public void setCompletedQuestions(Integer completedQuestions) {
        this.completedQuestions = completedQuestions;
    }

    public Integer getInProgressQuestions() {
        return inProgressQuestions;
    }

    public void setInProgressQuestions(Integer inProgressQuestions) {
        this.inProgressQuestions = inProgressQuestions;
    }

    public Integer getTodoQuestions() {
        return todoQuestions;
    }

    public void setTodoQuestions(Integer todoQuestions) {
        this.todoQuestions = todoQuestions;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
