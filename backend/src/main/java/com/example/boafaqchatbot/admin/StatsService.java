package com.example.boafaqchatbot.admin;

import com.example.boafaqchatbot.history.ChatHistory;
import com.example.boafaqchatbot.history.ChatHistoryService;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class StatsService {

    private final ChatHistoryService history;

    public StatsService(ChatHistoryService history) {
        this.history = history;
    }

    public Map<String, Object> getStats() {
        List<ChatHistory> list = history.getAll();

        // Top 5 most asked questions
        Map<String, Long> topQuestions = list.stream()
                .collect(Collectors.groupingBy(ChatHistory::getQuestion, Collectors.counting()));

        var top5 = topQuestions.entrySet()
                .stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .map(entry -> List.of(entry.getKey(), entry.getValue()))
                .toList();

        // Confidence metrics
        double avgConfidence = list.stream()
                .mapToDouble(ChatHistory::getConfidence)
                .average().orElse(0);

        double maxConfidence = list.stream()
                .mapToDouble(ChatHistory::getConfidence)
                .max().orElse(0);

        // Source breakdown
        Map<String, Long> sourceCounts = list.stream()
                .filter(c -> c.getSource() != null)
                .collect(Collectors.groupingBy(ChatHistory::getSource, Collectors.counting()));

        // Unique users (non-null userEmail)
        long uniqueUsers = list.stream()
                .map(ChatHistory::getUserEmail)
                .filter(e -> e != null && !e.isBlank())
                .distinct()
                .count();

        // Unique sessions (non-null sessionId)
        long uniqueSessions = list.stream()
                .map(ChatHistory::getSessionId)
                .filter(s -> s != null && !s.isBlank())
                .distinct()
                .count();

        // High confidence rate: % of answers with confidence > 0.70
        long highConfidenceCount = list.stream()
                .filter(c -> c.getConfidence() >= 0.70)
                .count();

        double satisfactionRate = list.isEmpty() ? 0
                : Math.round((highConfidenceCount * 100.0 / list.size()) * 10.0) / 10.0;

        // RPA jobs count
        long rpaCount = sourceCounts.getOrDefault("RPA_STARTED", 0L);

        Map<String, Object> stats = new HashMap<>();
        stats.put("total", list.size());
        stats.put("avgConfidence", Math.round(avgConfidence * 100.0) / 100.0);
        stats.put("maxConfidence", Math.round(maxConfidence * 100.0) / 100.0);
        stats.put("top5", top5);
        stats.put("sources", sourceCounts);
        stats.put("uniqueUsers", uniqueUsers);
        stats.put("uniqueSessions", uniqueSessions);
        stats.put("satisfactionRate", satisfactionRate);
        stats.put("rpaCount", rpaCount);

        return stats;
    }
}
