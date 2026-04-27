package com.example.boafaqchatbot.ai;

import com.example.boafaqchatbot.faq.FaqItem;
import com.example.boafaqchatbot.faq.FaqStore;
import com.example.boafaqchatbot.util.TextNorm;
import com.example.boafaqchatbot.util.VectorMath;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.Arrays;
import java.util.stream.Collectors;

@Service
public class OllamaRagService {

    private final OllamaClient ollama;
    private final FaqStore store;

    public OllamaRagService(OllamaClient ollama, FaqStore store) {
        this.ollama = ollama;
        this.store = store;
    }

    public String answerWithFaqContext(String userQuestion) {
        if (userQuestion == null || userQuestion.isBlank())
            return null;

        List<ScoredFaq> top = topK(userQuestion, 5);
        String prompt = buildPrompt(userQuestion, top);
        return ollama.generate(prompt);
    }

    private List<ScoredFaq> topK(String userQuestion, int k) {
        double[] userEmbedding = ollama.embeddings(userQuestion);
        if (userEmbedding == null) return List.of();

        List<ScoredFaq> scored = new ArrayList<>();
        for (FaqItem f : store.all()) {
<<<<<<< HEAD
            if (f.embedding() == null || f.embedding().length == 0) continue;
            double score = VectorMath.cosineSimilarity(userEmbedding, f.embedding());
=======
            double score = combinedScore(normalized, f.normQuestion());
>>>>>>> 6187067aa60f3fc3c6d1786692066b5b6dfca226
            scored.add(new ScoredFaq(f, score));
        }
        scored.sort(Comparator.comparingDouble(ScoredFaq::score).reversed());
        return scored.subList(0, Math.min(k, scored.size()));
    }

    private double combinedScore(String normalizedMessage, String normalizedFaqQuestion) {
        double jw = similarity.apply(normalizedMessage, normalizedFaqQuestion);
        double token = tokenF1Score(normalizedMessage, normalizedFaqQuestion);
        double queryCoverage = queryCoverageScore(normalizedMessage, normalizedFaqQuestion);
        double shortQueryBoost = shortQueryBoost(normalizedMessage, queryCoverage);
        return Math.min(1.0, (jw * 0.30) + (token * 0.35) + (queryCoverage * 0.35) + shortQueryBoost);
    }

    private double tokenF1Score(String normalizedMessage, String normalizedFaqQuestion) {
        Set<String> qTokens = tokenize(normalizedMessage);
        Set<String> fTokens = tokenize(normalizedFaqQuestion);
        if (qTokens.isEmpty() || fTokens.isEmpty())
            return 0;

        long common = qTokens.stream().filter(fTokens::contains).count();
        if (common == 0)
            return 0;

        double precision = (double) common / fTokens.size();
        double recall = (double) common / qTokens.size();
        return (2 * precision * recall) / (precision + recall);
    }

    private double queryCoverageScore(String normalizedMessage, String normalizedFaqQuestion) {
        Set<String> qTokens = tokenize(normalizedMessage);
        Set<String> fTokens = tokenize(normalizedFaqQuestion);
        if (qTokens.isEmpty() || fTokens.isEmpty())
            return 0;
        long common = qTokens.stream().filter(fTokens::contains).count();
        return (double) common / qTokens.size();
    }

    private double shortQueryBoost(String normalizedMessage, double queryCoverage) {
        int tokenCount = tokenize(normalizedMessage).size();
        if (tokenCount <= 2 && queryCoverage >= 1.0)
            return 0.22;
        if (tokenCount <= 3 && queryCoverage >= 0.66)
            return 0.1;
        return 0;
    }

    private Set<String> tokenize(String normalized) {
        Set<String> stopWords = Set.of(
                "est", "quoi", "ce", "qu", "que", "qui", "un", "une", "le", "la", "les", "des",
                "de", "du", "pour", "dans", "sur", "avec", "comment", "pourquoi", "au", "aux",
                "et", "ou", "je", "tu", "il", "elle", "on", "nous", "vous", "ils", "elles",
                "mon", "ton", "son", "ma", "ta", "sa", "mes", "tes", "ses", "ca", "fait",
                "faire", "etre", "avoir", "sont", "ont", "suis", "es", "avez", "avez-vous");
        return Arrays.stream(normalized.split("\\s+"))
                .filter(t -> t.length() > 1 && !stopWords.contains(t))
                .collect(Collectors.toSet());
    }

    private String buildPrompt(String userQuestion, List<ScoredFaq> context) {
        StringBuilder sb = new StringBuilder();
        sb.append("Tu es un assistant hotline Bank of Africa. ");
        sb.append("Réponds en français, de façon concise et utile. ");
        sb.append("Utilise uniquement les informations de la FAQ ci-dessous. ");
        sb.append("Si la FAQ ne contient pas la réponse, dis clairement que tu ne sais pas.\n\n");
        sb.append("FAQ (extraits):\n");
        for (int i = 0; i < context.size(); i++) {
            ScoredFaq item = context.get(i);
            sb.append("- Q").append(i + 1).append(": ").append(item.faq().question()).append("\n");
            sb.append("  R").append(i + 1).append(": ").append(item.faq().answer()).append("\n");
        }
        sb.append("\nQuestion utilisateur: ").append(userQuestion).append("\n");
        sb.append("Réponse:");
        return sb.toString();
    }

    private record ScoredFaq(FaqItem faq, double score) {
    }
}
