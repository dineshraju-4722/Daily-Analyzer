package com.application.backend.repository;

import com.application.backend.model.ProgressHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProgressHistoryRepository extends JpaRepository<ProgressHistory, Long> {
    Optional<ProgressHistory> findByDate(LocalDate date);
    List<ProgressHistory> findByDateBetweenOrderByDateAsc(LocalDate startDate, LocalDate endDate);
}
