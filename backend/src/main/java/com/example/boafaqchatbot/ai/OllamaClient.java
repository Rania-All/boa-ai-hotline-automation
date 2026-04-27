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
    private final Duration timeout;

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
        this.timeout = Duration.ofMillis(Math.max(1000, timeoutMs));
    }

<<<<<<< HEAD
    public record GenerateResponse(String response) {}
    public record EmbeddingResponse(double[][] embeddings) {}

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
                    .timeout(timeout)
                    .block();

            if (res != null && res.embeddings() != null && res.embeddings().length > 0) {
                return res.embeddings()[0];
            }
            return null;
        } catch (Exception e) {
            System.err.println("❌ Ollama Embedding Error: " + e.getMessage());
            return null;
        }
=======
    public record GenerateResponse(String response) {
    }

    public record EmbedResponse(double[] embedding) {
>>>>>>> 6187067aa60f3fc3c6d1786692066b5b6dfca226
    }

    public String generate(String prompt) {
        if (!enabled)
            return null;

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
                    .timeout(timeout)
                    .block();

            if (res == null || res.response() == null)
                return null;
            String text = res.response().trim();
            return text.isEmpty() ? null : text;
        } catch (WebClientResponseException e) {
            return null;
        } catch (Exception e) {
            return null;
        }
    }

    public double[] embed(String text) {
        if (!enabled)
            return null;
        try {
            EmbedResponse res = webClient.post()
                    .uri("/api/embeddings")
                    .contentType(MediaType.APPLICATION_JSON)
                    .accept(MediaType.APPLICATION_JSON)
                    .bodyValue(Map.of(
                            "model", model,
                            "prompt", text))
                    .retrieve()
                    .bodyToMono(EmbedResponse.class)
                    .timeout(timeout)
                    .block();
            return res != null ? res.embedding() : null;
        } catch (Exception e) {
            return null;
        }
    }
}
