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
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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
    private final ObjectMapper objectMapper;

    public ChatService(FaqStore store, NlpService nlp, ChatHistoryService history, UiPathOrchestratorClient rpa,
            OllamaRagService ollamaRag, OllamaClient ollama, ObjectMapper objectMapper) {
        this.store = store;
        this.nlp = nlp;
        this.history = history;
        this.rpa = rpa;
        this.ollamaRag = ollamaRag;
        this.ollama = ollama;
        this.objectMapper = objectMapper;
    }

    public ChatResponse reply(String message, String sessionId, Double solde, String numeroCompte, String userEmail,
            String loginCompte, String loginPassword, Boolean cardBlocked, Boolean cardDotationEcommerce,
            Boolean cardDotationTouristique) {
        System.out.println("\n>>> DEBUG: Message reçu du site : [" + message + "]");
        message = message == null ? "" : message.trim();
        if (message.isEmpty()) {
            return new ChatResponse("Veuillez saisir une question.", 0, null, List.of());
        }

        // 1) Intent NLP (Priorité au déclenchement du Robot)
        Intent intent = nlp.detectIntent(message);

        // On capture la réponse dans une variable pour TOUJOURS enregistrer dans
        // l'historique
        ChatResponse response;

        if (intent == Intent.VIREMENT) {
            response = triggerRpa(message, "VIREMENT", solde, numeroCompte, userEmail, loginCompte, loginPassword);
        } else if (intent == Intent.CARD_UNBLOCK) {
            if (cardBlocked != null && !cardBlocked) {
                response = new ChatResponse("carte déjà débloquée", 1.0, "RPA_ALREADY_ACTIVE", List.of("Retour"));
            } else {
                response = triggerCardRpa("CARD_UNBLOCK", "déblocage de carte", userEmail, loginCompte, loginPassword);
            }
        } else if (intent == Intent.DOTATION_ECOMMERCE) {
            if (cardDotationEcommerce != null && cardDotationEcommerce) {
                response = new ChatResponse("dotation e-commerce déjà active", 1.0, "RPA_ALREADY_ACTIVE",
                        List.of("Retour"));
            } else {
                response = triggerCardRpa("DOTATION_ECOMMERCE", "activation dotation e-commerce", userEmail,
                        loginCompte, loginPassword);
            }
        } else if (intent == Intent.DOTATION_TOURISTIQUE) {
            if (cardDotationTouristique != null && cardDotationTouristique) {
                response = new ChatResponse("dotation touristique déjà active", 1.0, "RPA_ALREADY_ACTIVE",
                        List.of("Retour"));
            } else {
                response = triggerCardRpa("DOTATION_TOURISTIQUE", "activation dotation touristique", userEmail,
                        loginCompte, loginPassword);
            }
        } else if (intent == Intent.GREETING) {
            response = quick("Bonjour ! Je suis l'assistant intelligent de BANK OF AFRICA. Que puis-je faire pour vous aujourd'hui ?");
        } else {
            // 2) FAQ Sémantique
            ChatResponse faqResponse = similarityEngine(message);
            if (faqResponse.confidence() >= 0.60) {
                history.save(message, faqResponse.answer(), faqResponse.confidence(), sessionId, faqResponse.source(),
                        userEmail, faqResponse.faqItem(), faqResponse.ticketType());
                return faqResponse;
            }

            // 3) Switch sur intent NLP
            response = switch (intent) {
                case CONSULTER_SOLDE ->
                    quick("Vous pouvez consulter votre solde via BOA Mobile, le portail web ou en agence.");
                case OUVERTURE_COMPTE ->
                    quick("Pour ouvrir un compte, munissez-vous de votre CIN et justificatif de domicile.");
                case VIREMENT ->
                    triggerRpa(message, "VIREMENT", solde, numeroCompte, userEmail, loginCompte, loginPassword);
                case CARD_UNBLOCK -> (cardBlocked != null && !cardBlocked)
                        ? new ChatResponse("carte déjà débloquée", 1.0, "RPA_ALREADY_ACTIVE", List.of("Retour"))
                        : triggerCardRpa("CARD_UNBLOCK", "déblocage de carte", userEmail, loginCompte, loginPassword);
                case DOTATION_ECOMMERCE -> (cardDotationEcommerce != null && cardDotationEcommerce)
                        ? new ChatResponse("dotation e-commerce déjà active", 1.0, "RPA_ALREADY_ACTIVE",
                                List.of("Retour"))
                        : triggerCardRpa("DOTATION_ECOMMERCE", "activation dotation e-commerce", userEmail, loginCompte,
                                loginPassword);
                case DOTATION_TOURISTIQUE -> (cardDotationTouristique != null && cardDotationTouristique)
                        ? new ChatResponse("dotation touristique déjà active", 1.0, "RPA_ALREADY_ACTIVE",
                                List.of("Retour"))
                        : triggerCardRpa("DOTATION_TOURISTIQUE", "activation dotation touristique", userEmail,
                                loginCompte, loginPassword);
                case CARTE_BANCAIRE -> quick("Les cartes bancaires BOA sont disponibles sous 5 jours ouvrables.");
                case FRAIS -> quick("Les frais varient selon le type de compte. Consultez la brochure tarifaire BOA.");
                case TEG -> quick(
                        "Le taux annuel effectif global (TEG) est le coût total d'un crédit exprimé en pourcentage annuel et calculé selon les normes fixées par Bank Al Maghreb.");
                case RPA_N1_RR ->
                    triggerRpa(message, "GENERAL_RPA", solde, numeroCompte, userEmail, loginCompte, loginPassword);
                default -> ollamaFallback(message);
            };
        }

        // Enregistrement dans l'historique pour TOUS les cas (RPA, erreurs logiques, NLP...)
        history.save(message, response.answer(), response.confidence(), sessionId, response.source(), userEmail, response.faqItem(), response.ticketType());
        return response;
    }

    private ChatResponse ollamaFallback(String message) {
        if (!ollama.isEnabled()) {
            return new ChatResponse(
                    "Le service d'assistance par IA (Ollama) est actuellement désactivé. Veuillez reformuler votre question ou contacter l'agence.",
                    0, "FALLBACK_SERVICE_DISABLED", List.of("Retour"));
        }

        try {
            String llm = ollamaRag.answerWithFaqContext(message);
            if (llm == null || llm.isBlank()) {
                return new ChatResponse(
                        "Désolé, le service d'assistance intelligente est temporairement indisponible. Veuillez réessayer ultérieurement.",
                        0, "FALLBACK_SERVICE_ERROR", List.of("Retour"));
            }
            return new ChatResponse(llm, 0.55, "OLLAMA_RAG", List.of());
        } catch (Exception e) {
            System.err.println("❌ Error calling Ollama RAG fallback: " + e.getMessage());
            return new ChatResponse(
                    "Une erreur est survenue lors de la communication avec l'assistant virtuel. Veuillez réessayer plus tard.",
                    0, "FALLBACK_SERVICE_ERROR", List.of("Retour"));
        }
    }

    private ChatResponse triggerRpa(String message, String action, Double solde, String numeroCompte, String userEmail,
            String loginCompte, String loginPassword) {
        // Extraction intelligente des paramètres via Ollama
        String prompt = "Extrait le montant (chiffre), le nom du bénéficiaire et le numéro de compte de cette phrase: \""
                + message +
                "\". Répond uniquement au format JSON: {\"montant\": \"...\", \"beneficiaire\": \"...\", \"compte\": \"...\",\"intentCode\": \"...\"}";
        String extractionJson = ollama.generate(prompt);
        System.out.println(">>> DEBUG: Extraction JSON brute : " + extractionJson);

        String montant = "0";
        String beneficiaire = "Inconnu";
        String compte = "0000000000";
        String intentCode = "0";

        if (extractionJson != null && !extractionJson.isBlank()) {
            try {
                String cleanJson = cleanJsonResponse(extractionJson);
                JsonNode node = objectMapper.readTree(cleanJson);

                if (node.has("montant")) {
                    montant = node.get("montant").asText().replaceAll("[^0-9]", "");
                }
                if (node.has("beneficiaire")) {
                    beneficiaire = node.get("beneficiaire").asText().trim();
                }
                if (node.has("compte")) {
                    compte = node.get("compte").asText().replaceAll("[^0-9]", "").trim();
                }
                if (node.has("intentCode")) {
                    intentCode = node.get("intentCode").asText().trim();
                }

                System.out.println(">>> DEBUG: Paramètres extraits - Montant: " + montant + ", Bénéficiaire: "
                        + beneficiaire + ", Compte: " + compte);
            } catch (Exception e) {
                System.err.println("❌ Erreur lors du parsing JSON de l'extraction : " + e.getMessage());
            }
        }

        // --- REGEX FALLBACK PARSING ---
        if (montant == null || montant.trim().isEmpty() || "0".equals(montant)) {
            java.util.regex.Pattern amtPattern = java.util.regex.Pattern.compile("(?i)\\b(\\d+(?:[.,]\\d+)?)\\s*(?:dh|dirham|mad|dhs)\\b");
            java.util.regex.Matcher amtMatcher = amtPattern.matcher(message);
            if (amtMatcher.find()) {
                montant = amtMatcher.group(1).split("[.,]")[0];
            } else {
                java.util.regex.Pattern numPattern = java.util.regex.Pattern.compile("\\b(\\d{1,6})\\b");
                java.util.regex.Matcher numMatcher = numPattern.matcher(message);
                while (numMatcher.find()) {
                    String val = numMatcher.group(1);
                    if (!val.equals("0")) {
                        montant = val;
                        break;
                    }
                }
            }
        }

        if (compte == null || compte.trim().isEmpty() || "0000000000".equals(compte)) {
            java.util.regex.Pattern accPattern = java.util.regex.Pattern.compile("\\b(\\d{10,24})\\b");
            java.util.regex.Matcher accMatcher = accPattern.matcher(message);
            if (accMatcher.find()) {
                compte = accMatcher.group(1);
            }
        }

        if (beneficiaire == null || beneficiaire.trim().isEmpty() || "Inconnu".equalsIgnoreCase(beneficiaire)) {
            java.util.regex.Pattern benPattern = java.util.regex.Pattern.compile("(?i)\\b(?:a|à|vers|pour|profit de)\\s+([a-zA-ZÀ-ÿ]+)\\b");
            java.util.regex.Matcher benMatcher = benPattern.matcher(message);
            if (benMatcher.find()) {
                beneficiaire = benMatcher.group(1);
            }
        }

        System.out.println(">>> DEBUG: Paramètres finaux - Montant: " + montant + ", Bénéficiaire: "
                + beneficiaire + ", Compte: " + compte);

        System.out.println("IntentCode");
        // Préparation des arguments pour UiPath

        Map<String, Object> uipathArgs = Map.of(
                "in_IntentCode", "VIREMENT",
                "in_Amount", montant,
                "in_BeneficiaryName", beneficiaire,
                "in_SourceAccount", compte,
                "in_UserEmail", userEmail != null ? userEmail : "",
                "in_Reason", "Virement via Chatbot",
                "in_LoginCompte", loginCompte != null ? loginCompte : "",
                "in_LoginPassword", loginPassword != null ? loginPassword : "");

        // ── VERIFICATIONS FONCTIONNELLES & LOGIQUES ──
        double montantValue = 0;
        try {
            montantValue = Double.parseDouble(montant);
        } catch (Exception e) {
        }

        // Cas 1 : Montant invalide ou égal à zéro
        if (montantValue <= 0) {
            return new ChatResponse(
                    "❌ Opération refusée : Le montant spécifié doit être supérieur à 0 DH pour effectuer un virement.",
                    1.0, "RPA_ERROR_INVALID_AMOUNT", List.of("Modifier le montant", "Retour"));
        }

        // Cas 2 : Dépassement de la limite de transfert autorisée par le Chatbot
        if (montantValue > 20000) {
            return new ChatResponse(
                    "❌ Limite de sécurité dépassée : Le montant maximum autorisé pour un virement via l'assistant virtuel est de 20 000 DH (Montant demandé : "
                            + montantValue
                            + " DH).\n\nPour les montants plus élevés, veuillez utiliser votre espace de banque en ligne ou vous rendre en agence.",
                    1.0, "RPA_ERROR_LIMIT_EXCEEDED", List.of("Modifier le montant", "Contacter le conseiller"));
        }

        // Cas 3 : Numéro de compte destinataire invalide
        if (compte == null || compte.trim().isEmpty() || compte.length() < 10 || "0000000000".equals(compte)) {
            return new ChatResponse(
                    "❌ Compte destinataire invalide : Le numéro de compte détecté ("
                            + (compte != null ? compte : "vide")
                            + ") est incorrect.\n\nVeuillez spécifier un numéro de compte valide comportant au moins 10 chiffres.",
                    1.0, "RPA_ERROR_INVALID_ACCOUNT", List.of("Saisir un autre compte", "Retour"));
        }

        // Cas 4 : Solde insuffisant (Vérification du solde actuel du compte émetteur)
        if (solde != null && solde < montantValue) {
            return new ChatResponse(
                    "❌ Échec de l'opération : Vous ne disposez pas d'un solde suffisant pour effectuer ce virement de "
                            + montantValue + " DH (Votre solde actuel : " + solde + " DH).",
                    1.0, "RPA_ERROR_INSUFFICIENT_BALANCE", List.of("Consulter mon solde", "Modifier le montant"));
        }

        UiPathOrchestratorClient.StartJobResult started = rpa.startJob(uipathArgs);

        if ("DISABLED".equalsIgnoreCase(started.state())) {
            return new ChatResponse(
                    "Votre demande de " + action.toLowerCase()
                            + " nécessite un traitement automatisé (RPA), mais le robot n'est pas encore configuré. "
                            + "Activez UiPath dans `application.properties`.",
                    0.6, "RPA", List.of("Activer UiPath Orchestrator"));
        }

        if (started.jobKey() == null) {
            return new ChatResponse(
                    "⚠️ Erreur Technique : Impossible de lancer le robot RPA. "
                            + (started.message() != null ? started.message()
                                    : "Vérifiez la connexion avec l'Orchestrator."),
                    1.0, "RPA_ERROR_TECHNICAL", List.of("Réessayer plus tard", "Contacter support"));
        }

        return new ChatResponse(
                "✅ Demande reçue. J'ai lancé le robot RPA pour effectuer votre " + action.toLowerCase() + " de "
                        + montant + " DH vers " + beneficiaire + ". (ID: " + started.jobKey() + ")",
                0.9, "RPA_STARTED", List.of("Suivre le statut"), started.jobKey(), "STARTED");
    }

    public Map<?, ?> getJobStatus(String jobKey) {
        return rpa.getJobStatus(jobKey);
    }

    private ChatResponse triggerCardRpa(String intentCode, String actionLabel, String userEmail, String loginCompte,
            String loginPassword) {
        // Pour les cartes, on envoie juste l'intention au robot
        Map<String, Object> uipathArgs = Map.of(
                "in_IntentCode", intentCode,
                "in_UserEmail", userEmail != null ? userEmail : "",
                "in_LoginCompte", loginCompte != null ? loginCompte : "",
                "in_LoginPassword", loginPassword != null ? loginPassword : "");

        UiPathOrchestratorClient.StartJobResult started = rpa.startJob(uipathArgs);

        if (started.jobKey() == null) {
            return new ChatResponse(
                    "⚠️ Erreur : Impossible de lancer le robot pour votre " + actionLabel + ".",
                    1.0, "RPA_ERROR", List.of("Contacter support"));
        }

        return new ChatResponse(
                "✅ Demande reçue. Je lance le robot pour votre " + actionLabel + ". (ID: " + started.jobKey() + ")",
                0.9, "RPA_STARTED", List.of("Vérifier mes cartes"), started.jobKey(), "STARTED");
    }

    /** Advanced Hybrid Similarity (Semantic + Keyword Overlap) */
    private ChatResponse similarityEngine(String message) {
        String normalizedMsg = TextNorm.norm(message).toLowerCase();
        double[] userEmbedding = ollama.embeddings(message);

        String[] queryTokens = normalizedMsg.split("\\s+");

        List<ScoredMatch> matches = new ArrayList<>(store.all().parallelStream()
                .map(f -> {
                    double semanticScore = 0;
                    if (userEmbedding != null && f.embedding() != null
                            && f.embedding().length == userEmbedding.length) {
                        semanticScore = VectorMath.cosineSimilarity(userEmbedding, f.embedding());
                    }

                    // Keyword Overlap Scoring
                    String faqQNorm = f.normQuestion().toLowerCase();
                    int matchedTokens = 0;
                    int validTokens = 0;
                    for (String qt : queryTokens) {
                        if (qt.length() > 2) { // Ignore short words
                            validTokens++;
                            if (faqQNorm.contains(qt)) {
                                matchedTokens++;
                            }
                        }
                    }

                    double tokenScore = 0;
                    if (validTokens > 0) {
                        double overlapRatio = (double) matchedTokens / validTokens;
                        double lengthFactor = Math.min(1.0, 30.0 / Math.max(1, f.question().length()));
                        tokenScore = (overlapRatio * 0.8) + (lengthFactor * 0.2);
                    }

                    double finalScore = Math.max(semanticScore, tokenScore);
                    return new ScoredMatch(f, finalScore);
                })
                .toList());

        matches.sort((a, b) -> Double.compare(b.score(), a.score()));

        ScoredMatch best = matches.isEmpty() ? null : matches.get(0);

        if (best == null || best.score() < 0.60) {
            return new ChatResponse(
                    "Je n'ai pas compris votre demande. Pouvez-vous reformuler ?",
                    best != null ? best.score() : 0, null, List.of());
        }

        return new ChatResponse(best.faq().answer(), best.score(), "FAQ", List.of(), null, null, best.faq(), "N1-IN");
    }

    private record ScoredMatch(FaqItem faq, double score) {
    }

    /** Quick response for NLP intents */
    private ChatResponse quick(String text) {
        return new ChatResponse(text, 0.99, "NLP INTENT", List.of(), "N1-IN");
    }

    private String cleanJsonResponse(String json) {
        if (json == null)
            return "{}";
        String cleaned = json.trim();
        // Enlève les balises markdown ```json ... ``` ou ``` ... ```
        if (cleaned.startsWith("```")) {
            cleaned = cleaned.replaceAll("^```(?:json)?", "").replaceAll("```$", "").trim();
        }
        // Trouve le premier { et le dernier } pour isoler l'objet JSON
        int firstBrace = cleaned.indexOf('{');
        int lastBrace = cleaned.lastIndexOf('}');
        if (firstBrace != -1 && lastBrace != -1 && lastBrace > firstBrace) {
            cleaned = cleaned.substring(firstBrace, lastBrace + 1);
        }
        return cleaned;
    }

    public record ChatResponse(
            String answer,
            double confidence,
            String source,
            List<String> suggestions,
            String jobKey,
            String status,
            FaqItem faqItem,
            String ticketType) {
        public ChatResponse(String answer, double confidence, String source, List<String> suggestions) {
            this(answer, confidence, source, suggestions, null, null, null, "N1-IN");
        }
        public ChatResponse(String answer, double confidence, String source, List<String> suggestions, String ticketType) {
            this(answer, confidence, source, suggestions, null, null, null, ticketType);
        }
        public ChatResponse(String answer, double confidence, String source, List<String> suggestions, String jobKey, String status) {
            this(answer, confidence, source, suggestions, jobKey, status, null, "N1-RR");
        }
    }
}
