package com.example.boafaqchatbot.history;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Entity
@Table(name = "chat_history")
public class ChatHistory {

    @Id
    private String id;

    @Column(nullable = false, length = 4000)
    private String question;

    @Column(nullable = false, length = 10000)
    private String answer;

    @Column(nullable = false)
    private double confidence;

    @Column(name = "session_id", length = 128)
    private String sessionId;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    protected ChatHistory() {
        // for JPA
    }

    public ChatHistory(String q, String a, double c, String sessionId) {
        this.id = UUID.randomUUID().toString();
        this.question = q;
        this.answer = a;
        this.confidence = c;
        this.sessionId = sessionId;
        this.createdAt = OffsetDateTime.now();
    }

    public String getId() { return id; }
    public String getQuestion() { return question; }
    public String getAnswer() { return answer; }
    public double getConfidence() { return confidence; }

    @Transient
    public String getTimestamp() {
        return createdAt == null ? null : createdAt.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));
    }

    @JsonProperty("created_at")
    public OffsetDateTime getCreatedAt() { return createdAt; }

    @JsonProperty("session_id")
    public String getSessionId() { return sessionId; }
}

