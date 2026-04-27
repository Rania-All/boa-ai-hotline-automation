package com.example.boafaqchatbot.history;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatHistoryRepository extends JpaRepository<ChatHistory, String> {

    List<ChatHistory> findAllByOrderByCreatedAtDesc();

    List<ChatHistory> findAllBySessionIdOrderByCreatedAtDesc(String sessionId);
}

