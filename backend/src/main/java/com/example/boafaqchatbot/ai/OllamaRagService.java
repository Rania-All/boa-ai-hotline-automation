package com.example.boafaqchatbot.ai;

import com.example.boafaqchatbot.faq.FaqItem;
import com.example.boafaqchatbot.faq.FaqStore;
import com.example.boafaqchatbot.util.TextNorm;
import com.example.boafaqchatbot.util.VectorMath;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class OllamaRagService {

    private final OllamaClient ollama;
    private final FaqStore store;

    public OllamaRagService(OllamaClient ollama, FaqStore store) {
        this.ollama = ollama;
        this.store = store;
    }

    public String answerWithFaqContext(String userQuestion) {
        if (userQuestion == null || userQuestion.isBlank()) return null;

        List<ScoredFaq> top = topK(userQuestion, 5);
        String prompt = buildPrompt(userQuestion, top);
        return ollama.generate(prompt);
    }

    private List<ScoredFaq> topK(String userQuestion, int k) {
        double[] userEmbedding = ollama.embeddings(userQuestion);
        if (userEmbedding == null) return List.of();

        List<ScoredFaq> scored = new ArrayList<>();
        for (FaqItem f : store.all()) {
            if (f.embedding() == null || f.embedding().length == 0) continue;
            double score = VectorMath.cosineSimilarity(userEmbedding, f.embedding());
            scored.add(new ScoredFaq(f, score));
        }
        scored.sort(Comparator.comparingDouble(ScoredFaq::score).reversed());
        return scored.subList(0, Math.min(k, scored.size()));
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

    private record ScoredFaq(FaqItem faq, double score) {}
}

