package com.application.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "progress_history")
public class ProgressHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private LocalDate date;

    @Column(nullable = false)
    private Integer totalQuestions = 0;

    @Column(nullable = false)
    private Integer completedQuestions = 0;

    @Column(nullable = false)
    private Integer inProgressQuestions = 0;

    @Column(nullable = false)
    private Integer todoQuestions = 0;

    public ProgressHistory() {}

    public ProgressHistory(LocalDate date) {
        this.date = date;
        this.totalQuestions = 0;
        this.completedQuestions = 0;
        this.inProgressQuestions = 0;
        this.todoQuestions = 0;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public Integer getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(Integer totalQuestions) { this.totalQuestions = totalQuestions; }

    public Integer getCompletedQuestions() { return completedQuestions; }
    public void setCompletedQuestions(Integer completedQuestions) { this.completedQuestions = completedQuestions; }

    public Integer getInProgressQuestions() { return inProgressQuestions; }
    public void setInProgressQuestions(Integer inProgressQuestions) { this.inProgressQuestions = inProgressQuestions; }

    public Integer getTodoQuestions() { return todoQuestions; }
    public void setTodoQuestions(Integer todoQuestions) { this.todoQuestions = todoQuestions; }
}
