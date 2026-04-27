package com.example.boafaqchatbot.service;

import com.example.boafaqchatbot.ai.OllamaRagService;
import com.example.boafaqchatbot.faq.FaqItem;
import com.example.boafaqchatbot.faq.FaqStore;
import com.example.boafaqchatbot.history.ChatHistoryService;
import com.example.boafaqchatbot.nlp.Intent;
import com.example.boafaqchatbot.nlp.NlpService;
import com.example.boafaqchatbot.rpa.UiPathOrchestratorClient;
import com.example.boafaqchatbot.util.TextNorm;
import com.example.boafaqchatbot.util.VectorMath;
import com.example.boafaqchatbot.ai.OllamaClient;
import org.apache.commons.text.similarity.JaroWinklerSimilarity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

@Service
public class ChatService {

    private final FaqStore store;
    private final NlpService nlp;
    private final ChatHistoryService history;
    private final UiPathOrchestratorClient rpa;
    private final OllamaRagService ollamaRag;
    private final OllamaClient ollama;
    private final JaroWinklerSimilarity stringSimilarity = new JaroWinklerSimilarity();

    public ChatService(FaqStore store, NlpService nlp, ChatHistoryService history, UiPathOrchestratorClient rpa, OllamaRagService ollamaRag, OllamaClient ollama) {
        this.store = store;
        this.nlp = nlp;
        this.history = history;
        this.rpa = rpa;
        this.ollamaRag = ollamaRag;
        this.ollama = ollama;
    }

    public ChatResponse reply(String message, String sessionId) {
        message = message == null ? "" : message.trim();
        if (message.isEmpty()) {
            return new ChatResponse("Veuillez saisir une question.", 0, null, List.of());
        }

        // 1) FAQ similarity first
        ChatResponse faqResponse = similarityEngine(message);
        if (faqResponse.confidence() >= 0.65) {
            history.save(message, faqResponse.answer(), faqResponse.confidence(), sessionId);
            return faqResponse;
        }

        // 2) Intent NLP
        Intent intent = nlp.detectIntent(message);

        ChatResponse response = switch (intent) {
            case CONSULTER_SOLDE -> quick("Vous pouvez consulter votre solde via BOA Mobile, le portail web ou en agence.");
            case OUVERTURE_COMPTE -> quick("Pour ouvrir un compte, munissez-vous de votre CIN et justificatif de domicile.");
            case VIREMENT -> quick("Les virements peuvent être effectués via l'application BOA Mobile ou en agence.");
            case BLOQUER_CARTE -> quick("Appelez immédiatement le centre client BOA pour bloquer votre carte.");
            case CARTE_BANCAIRE -> quick("Les cartes bancaires BOA sont disponibles sous 5 jours ouvrables.");
            case FRAIS -> quick("Les frais varient selon le type de compte. Consultez la brochure tarifaire BOA.");
            case RPA_N1_RR -> triggerRpa(message);
            default -> ollamaFallback(message);
        };

        history.save(message, response.answer(), response.confidence(), sessionId);
        return response;
    }

    private ChatResponse ollamaFallback(String message) {
        String llm = ollamaRag.answerWithFaqContext(message);
        if (llm == null || llm.isBlank()) {
            return new ChatResponse(
                    "Je n'ai pas compris votre demande. Pouvez-vous reformuler ?",
                    0, null, List.of()
            );
        }
        return new ChatResponse(llm, 0.55, "OLLAMA_RAG", List.of());
    }

    private ChatResponse triggerRpa(String message) {
        UiPathOrchestratorClient.StartJobResult started = rpa.startJob(Map.of(
                "source", "chatbot",
                "rawQuestion", message
        ));

        if ("DISABLED".equalsIgnoreCase(started.state())) {
            return new ChatResponse(
                    "Votre demande nécessite un traitement automatisé (RPA), mais le robot n'est pas encore configuré. " +
                            "Activez UiPath dans `application.properties` (uipath.enabled=true) et renseignez les credentials.",
                    0.6,
                    "RPA",
                    List.of("Activer UiPath Orchestrator", "Configurer releaseKey + folderId")
            );
        }

        return new ChatResponse(
                "J'ai déclenché un robot RPA pour traiter votre demande. " +
                        (started.jobKey() != null ? "Référence job: " + started.jobKey() : ""),
                0.85,
                "RPA",
                started.jobKey() == null ? List.of() : List.of("Suivre le statut: /api/rpa/status/" + started.jobKey())
        );
    }

    /** Advanced Hybrid Similarity (Semantic + Keyword Overlap) */
    private ChatResponse similarityEngine(String message) {
        String normalizedMsg = TextNorm.norm(message).toLowerCase();
        double[] userEmbedding = ollama.embeddings(message);
        
        List<ScoredMatch> matches = new ArrayList<>();
        String[] queryTokens = normalizedMsg.split("\\s+");

        for (FaqItem f : store.all()) {
            double semanticScore = 0;
            if (userEmbedding != null && f.embedding() != null && f.embedding().length == userEmbedding.length) {
                semanticScore = VectorMath.cosineSimilarity(userEmbedding, f.embedding());
            }
            
            // Keyword Overlap Scoring
            String faqQNorm = f.normQuestion().toLowerCase();
            int matchedTokens = 0;
            int validTokens = 0;
            for (String qt : queryTokens) {
                if (qt.length() > 2) { // Ignore short words like "le", "la", "un"
                    validTokens++;
                    if (faqQNorm.contains(qt)) {
                        matchedTokens++;
                    }
                }
            }
            
            double tokenScore = 0;
            if (validTokens > 0) {
                double overlapRatio = (double) matchedTokens / validTokens;
                // Length penalty: prefers shorter FAQ questions (definitions) when keywords match
                double lengthFactor = Math.min(1.0, 30.0 / Math.max(1, f.question().length()));
                tokenScore = (overlapRatio * 0.8) + (lengthFactor * 0.2);
            }
            
            // Take the best of Semantic and Keyword Match
            double finalScore = Math.max(semanticScore, tokenScore);

            matches.add(new ScoredMatch(f, finalScore));
        }

        matches.sort((a, b) -> Double.compare(b.score(), a.score()));
        
        System.out.println("--- 🔍 Résultats Sémantique + Mots-Clés pour: [" + message + "] ---");
        for (int i = 0; i < Math.min(3, matches.size()); i++) {
            ScoredMatch m = matches.get(i);
            System.out.println(String.format("   %d. Score: %.3f | Q: %s", (i+1), m.score(), m.faq().question()));
        }

        ScoredMatch best = matches.isEmpty() ? null : matches.get(0);

        // We use 0.65 as threshold, which is easily achievable by good semantic or keyword match
        if (best == null || best.score() < 0.65) { 
            return new ChatResponse(
                    "Je n'ai pas compris votre demande. Pouvez-vous reformuler ?",
                    best != null ? best.score() : 0, null, List.of()
            );
        }

        return new ChatResponse(best.faq().answer(), best.score(), best.faq().question(), List.of());
    }

    private record ScoredMatch(FaqItem faq, double score) {}

    /** Quick response for NLP intents */
    private ChatResponse quick(String text) {
        return new ChatResponse(text, 0.99, "NLP INTENT", List.of());
    }

    public record ChatResponse(
            String answer,
            double confidence,
            String matchedQuestion,
            List<String> suggestions
    ) {}
}

