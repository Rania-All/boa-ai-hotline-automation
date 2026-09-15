package com.example.boafaqchatbot.history;

import com.example.boafaqchatbot.faq.FaqItem;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import com.fasterxml.jackson.annotation.JsonIgnore;

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

    @Column(length = 64)
    private String source;

    @Column(name = "user_email", length = 128)
    private String userEmail;

    @Column(name = "ticket_type", length = 255)
    private String ticketType;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "faq_item_id", foreignKey = @ForeignKey(name = "fk_chat_history_faq_item"))
    private FaqItem faqItem;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    protected ChatHistory() {
        // for JPA
    }

    public ChatHistory(String q, String a, double c, String sessionId, String source, String userEmail, FaqItem faqItem, String ticketType) {
        this.id = UUID.randomUUID().toString();
        this.question = q;
        this.answer = a;
        this.confidence = c;
        this.sessionId = sessionId;
        this.source = source;
        this.userEmail = userEmail;
        this.faqItem = faqItem;
        this.ticketType = ticketType;
        this.createdAt = OffsetDateTime.now();
    }

    public ChatHistory(String q, String a, double c, String sessionId, String source, String userEmail, FaqItem faqItem) {
        this(q, a, c, sessionId, source, userEmail, faqItem, null);
    }

    public ChatHistory(String q, String a, double c, String sessionId, String source, String userEmail) {
        this(q, a, c, sessionId, source, userEmail, null, null);
    }

    public ChatHistory(String q, String a, double c, String sessionId, String source) {
        this(q, a, c, sessionId, source, null, null, null);
    }

    public ChatHistory(String q, String a, double c, String sessionId) {
        this(q, a, c, sessionId, null, null, null, null);
    }

    public String getId() { return id; }
    public String getQuestion() { return question; }
    public String getAnswer() { return answer; }
    public double getConfidence() { return confidence; }
    public String getSource() { return source; }
    @JsonIgnore
    public FaqItem getFaqItem() { return faqItem; }

    @JsonProperty("ticket_type")
    public String getTicketType() { return ticketType; }

    @JsonProperty("faq_item_id")
    public Long getFaqItemId() { return faqItem != null ? faqItem.getId() : null; }

    @Transient
    public String getTimestamp() {
        return createdAt == null ? null : createdAt.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));
    }

    @JsonProperty("created_at")
    public OffsetDateTime getCreatedAt() { return createdAt; }

    @JsonProperty("session_id")
    public String getSessionId() { return sessionId; }

    @JsonProperty("user_email")
    public String getUserEmail() { return userEmail; }
}


