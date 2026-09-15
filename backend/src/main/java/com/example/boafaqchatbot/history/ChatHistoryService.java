package com.example.boafaqchatbot.history;

import com.example.boafaqchatbot.faq.FaqItem;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatHistoryService {

    private final ChatHistoryRepository repo;

    public ChatHistoryService(ChatHistoryRepository repo) {
        this.repo = repo;
    }

    @PostConstruct
    public void migrateOldNullHistoryToRania() {
        try {
            int updatedCount = repo.assignNullEmailsToUser("raniaalgui4@gmail.com");
            if (updatedCount > 0) {
                System.out.println("[Migration] Assigned " + updatedCount + " old anonymous messages to raniaalgui4@gmail.com");
            }
        } catch (Exception e) {
            System.err.println("[Migration] Failed to migrate old history: " + e.getMessage());
        }
    }

    public void save(String question, String answer, double confidence, String sessionId, String source, String userEmail, FaqItem faqItem, String ticketType) {
        repo.save(new ChatHistory(question, answer, confidence, sessionId, source, userEmail, faqItem, ticketType));
    }

    public void save(String question, String answer, double confidence, String sessionId, String source, String userEmail, FaqItem faqItem) {
        save(question, answer, confidence, sessionId, source, userEmail, faqItem, null);
    }

    public void save(String question, String answer, double confidence, String sessionId, String source, String userEmail) {
        save(question, answer, confidence, sessionId, source, userEmail, null, null);
    }

    public void save(String question, String answer, double confidence, String sessionId, String source) {
        save(question, answer, confidence, sessionId, source, null, null, null);
    }

    public List<ChatHistory> getAll() {
        return repo.findAllByOrderByCreatedAtDesc();
    }

    public List<ChatHistory> getAllBySessionId(String sessionId) {
        if (sessionId == null || sessionId.isBlank()) return getAll();
        return repo.findAllBySessionIdOrderByCreatedAtDesc(sessionId);
    }

    public List<ChatHistory> getAllByUserEmail(String userEmail) {
        if (userEmail == null || userEmail.isBlank()) return getAll();
        // Filtrage strict par email pour garantir l'isolation complète par utilisateur
        return repo.findAllByUserEmailOrderByCreatedAtDesc(userEmail);
    }

    public void clear() {
        repo.deleteAll();
    }

    public void clearByUserEmail(String userEmail) {
        repo.deleteByUserEmail(userEmail);
    }
}
