package com.example.boafaqchatbot.admin;

import com.example.boafaqchatbot.history.ChatHistoryService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final StatsService stats;
    private final ChatHistoryService history;

    public AdminController(StatsService stats, ChatHistoryService history) {
        this.stats = stats;
        this.history = history;
    }

    @GetMapping("/stats")
    public Map<String, Object> stats() {
        return stats.getStats();
    }

    @GetMapping("/history")
    public Object history(@RequestParam(value = "sessionId", required = false) String sessionId) {
        return history.getAllBySessionId(sessionId);
    }

    @DeleteMapping("/history")
    public void clear() {
        history.clear();
    }
}

