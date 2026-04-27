package com.example.boafaqchatbot.faq;

import jakarta.persistence.*;

@Entity
@Table(name = "faq_items")
public class FaqItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 1000)
    private String question;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String answer;

    @Column(name = "norm_question", length = 1000)
    private String normQuestion;

    @Column(name = "embedding", columnDefinition = "double precision[]")
    private double[] embedding;

    protected FaqItem() {}

    public FaqItem(String question, String answer, String normQuestion) {
        this.question = question;
        this.answer = answer;
        this.normQuestion = normQuestion;
    }

    public FaqItem(String question, String answer, String normQuestion, double[] embedding) {
        this.question = question;
        this.answer = answer;
        this.normQuestion = normQuestion;
        this.embedding = embedding;
    }

    public Long getId() { return id; }
    public String question() { return question; }
    public String answer() { return answer; }
    public String normQuestion() { return normQuestion; }
    public double[] embedding() { return embedding; }

    public void setEmbedding(double[] embedding) { this.embedding = embedding; }
}
