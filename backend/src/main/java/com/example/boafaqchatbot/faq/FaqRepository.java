package com.example.boafaqchatbot.faq;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FaqRepository extends JpaRepository<FaqItem, Long> {
    Optional<FaqItem> findByQuestion(String question);
}
