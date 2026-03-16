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

        Map<String, Long> topQuestions = list.stream()
                .collect(Collectors.groupingBy(ChatHistory::getQuestion, Collectors.counting()));

        var top5 = topQuestions.entrySet()
                .stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .toList();

        double avgConfidence = list.stream()
                .mapToDouble(ChatHistory::getConfidence)
                .average().orElse(0);

        double maxConfidence = list.stream()
                .mapToDouble(ChatHistory::getConfidence)
                .max().orElse(0);

        Map<String, Object> stats = new HashMap<>();
        stats.put("total", list.size());
        stats.put("avgConfidence", Math.round(avgConfidence * 100.0) / 100.0);
        stats.put("maxConfidence", Math.round(maxConfidence * 100.0) / 100.0);
        stats.put("top5", top5);

        return stats;
    }
}

