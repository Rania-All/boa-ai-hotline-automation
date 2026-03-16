package com.example.boafaqchatbot.service;

import com.example.boafaqchatbot.ai.OllamaRagService;
import com.example.boafaqchatbot.faq.FaqItem;
import com.example.boafaqchatbot.faq.FaqStore;
import com.example.boafaqchatbot.history.ChatHistoryService;
import com.example.boafaqchatbot.nlp.Intent;
import com.example.boafaqchatbot.nlp.NlpService;
import com.example.boafaqchatbot.rpa.UiPathOrchestratorClient;
import com.example.boafaqchatbot.util.TextNorm;
import org.apache.commons.text.similarity.JaroWinklerSimilarity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ChatService {

    private final FaqStore store;
    private final NlpService nlp;
    private final ChatHistoryService history;
    private final UiPathOrchestratorClient rpa;
    private final OllamaRagService ollamaRag;
    private final JaroWinklerSimilarity similarity = new JaroWinklerSimilarity();

    public ChatService(FaqStore store, NlpService nlp, ChatHistoryService history, UiPathOrchestratorClient rpa, OllamaRagService ollamaRag) {
        this.store = store;
        this.nlp = nlp;
        this.history = history;
        this.rpa = rpa;
        this.ollamaRag = ollamaRag;
    }

    public ChatResponse reply(String message, String sessionId) {
        message = message == null ? "" : message.trim();
        if (message.isEmpty()) {
            return new ChatResponse("Veuillez saisir une question.", 0, null, List.of());
        }

        // 1) FAQ similarity first
        ChatResponse faqResponse = similarityEngine(message);
        if (faqResponse.confidence() >= 0.75) {
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

    /** Similarity engine on FAQ */
    private ChatResponse similarityEngine(String message) {
        String normalized = TextNorm.norm(message);
        double bestScore = 0;
        FaqItem best = null;

        for (FaqItem f : store.all()) {
            double score = similarity.apply(normalized, f.normQuestion());
            if (score > bestScore) {
                bestScore = score;
                best = f;
            }
        }

        if (best == null || bestScore < 0.75) {
            return new ChatResponse(
                    "Je n'ai pas compris votre demande. Pouvez-vous reformuler ?",
                    bestScore, null, List.of()
            );
        }

        return new ChatResponse(best.answer(), bestScore, best.question(), List.of());
    }

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

