package com.example.boafaqchatbot.faq;

public record FaqItem(String question, String answer, String normQuestion, double[] embedding) {
}
