package com.application.backend.repository;

import com.application.backend.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.time.LocalDateTime;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByTopicId(Long topicId);
    long countByTopicId(Long topicId);
    List<Question> findByStatusOrderByUpdatedAtDesc(Question.Status status, Pageable pageable);

    interface DailyCount {
        java.time.LocalDate getDate();
        long getCount();
    }

    @Query("select function('date', q.updatedAt) as date, count(q) as count " +
           "from Question q " +
           "where q.status = com.application.backend.model.Question$Status.DONE " +
           "and q.updatedAt between :start and :end " +
           "group by function('date', q.updatedAt) " +
           "order by date")
    List<DailyCount> countDailyDoneBetween(@Param("start") LocalDateTime start,
                                           @Param("end") LocalDateTime end);
}
