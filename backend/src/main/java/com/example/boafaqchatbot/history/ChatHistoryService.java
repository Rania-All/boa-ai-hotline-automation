package com.example.boafaqchatbot.history;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatHistoryService {

    private final ChatHistoryRepository repo;

    public ChatHistoryService(ChatHistoryRepository repo) {
        this.repo = repo;
    }

    public void save(String question, String answer, double confidence, String sessionId) {
        repo.save(new ChatHistory(question, answer, confidence, sessionId));
    }

    public List<ChatHistory> getAll() {
        return repo.findAll();
    }

    public List<ChatHistory> getAllBySessionId(String sessionId) {
        if (sessionId == null || sessionId.isBlank()) return getAll();
        return repo.findAllBySessionIdOrderByCreatedAtAsc(sessionId);
    }

    public void clear() {
        repo.deleteAll();
    }
}

