package com.example.boafaqchatbot.history;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ChatHistoryRepository extends JpaRepository<ChatHistory, String> {

    List<ChatHistory> findAllByOrderByCreatedAtDesc();

    List<ChatHistory> findAllBySessionIdOrderByCreatedAtDesc(String sessionId);

    List<ChatHistory> findAllByUserEmailOrderByCreatedAtDesc(String userEmail);

    @Transactional
    @Modifying
    @Query("UPDATE ChatHistory c SET c.userEmail = :email WHERE c.userEmail IS NULL")
    int assignNullEmailsToUser(@Param("email") String email);

    @Transactional
    void deleteByUserEmail(String userEmail);
}
