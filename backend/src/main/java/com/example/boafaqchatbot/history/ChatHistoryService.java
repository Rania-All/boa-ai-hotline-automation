package com.example.boafaqchatbot.history;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatHistoryService {

    private final ChatHistoryRepository repo;

    public ChatHistoryService(ChatHistoryRepository repo) {
        this.repo = repo;
    }

    public void save(String question, String answer, double confidence, String sessionId, String source) {
        repo.save(new ChatHistory(question, answer, confidence, sessionId, source));
    }

    public List<ChatHistory> getAll() {
        return repo.findAllByOrderByCreatedAtDesc();
    }

    public List<ChatHistory> getAllBySessionId(String sessionId) {
        if (sessionId == null || sessionId.isBlank()) return getAll();
        return repo.findAllBySessionIdOrderByCreatedAtDesc(sessionId);
    }

    public void clear() {
        repo.deleteAll();
    }
}

