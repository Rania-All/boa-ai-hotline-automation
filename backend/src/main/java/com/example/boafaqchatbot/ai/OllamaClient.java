package com.example.boafaqchatbot.ai;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.Duration;
import java.util.Map;

@Component
public class OllamaClient {

    private final WebClient webClient;
    private final String model;
    private final String embeddingModel;
    private final boolean enabled;
    private final Duration generateTimeout;
    private final Duration embeddingTimeout;

    public OllamaClient(
            WebClient.Builder builder,
            @Value("${ollama.base-url:http://localhost:11434}") String baseUrl,
            @Value("${ollama.model:llama3.1}") String model,
            @Value("${ollama.embedding-model:nomic-embed-text}") String embeddingModel,
            @Value("${ollama.enabled:true}") boolean enabled,
            @Value("${ollama.timeout-ms:15000}") long timeoutMs) {
        this.webClient = builder.baseUrl(baseUrl).build();
        this.model = model;
        this.embeddingModel = embeddingModel;
        this.enabled = enabled;
        this.generateTimeout = Duration.ofMillis(Math.max(1000, timeoutMs));
        this.embeddingTimeout = Duration.ofMillis(Math.min(3000, Math.max(1000, timeoutMs / 3)));
    }

    public boolean isEnabled() {
        return enabled;
    }

    public record GenerateResponse(String response) {}
    public record EmbeddingResponse(double[][] embeddings) {}

    /** Generate text response */
    public String generate(String prompt) {
        if (!enabled) return null;

        try {
            GenerateResponse res = webClient.post()
                    .uri("/api/generate")
                    .contentType(MediaType.APPLICATION_JSON)
                    .accept(MediaType.APPLICATION_JSON)
                    .bodyValue(Map.of(
                            "model", model,
                            "prompt", prompt,
                            "stream", false))
                    .retrieve()
                    .bodyToMono(GenerateResponse.class)
                    .timeout(generateTimeout)
                    .block();

            if (res == null || res.response() == null) return null;
            String text = res.response().trim();
            return text.isEmpty() ? null : text;
        } catch (Exception e) {
            System.err.println("❌ Ollama Generate Error: " + e.getMessage());
            return null;
        }
    }

    /** Generate vector embedding using /api/embed API */
    public double[] embeddings(String prompt) {
        if (!enabled) return null;

        try {
            EmbeddingResponse res = webClient.post()
                    .uri("/api/embed")
                    .contentType(MediaType.APPLICATION_JSON)
                    .accept(MediaType.APPLICATION_JSON)
                    .bodyValue(Map.of(
                            "model", embeddingModel,
                            "input", prompt
                    ))
                    .retrieve()
                    .bodyToMono(EmbeddingResponse.class)
                    .timeout(embeddingTimeout)
                    .block();

            if (res != null && res.embeddings() != null && res.embeddings().length > 0) {
                return res.embeddings()[0];
            }
            return null;
        } catch (Exception e) {
            System.err.println("❌ Ollama Embedding Error: " + e.getMessage());
            return null;
        }
    }
}
