package com.example.boafaqchatbot.rpa;

import jakarta.validation.constraints.NotBlank;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/rpa")
@Validated
@CrossOrigin(origins = "*")
public class RpaController {

    private final UiPathOrchestratorClient client;

    public RpaController(UiPathOrchestratorClient client) {
        this.client = client;
    }

    public record StartBody(@NotBlank String action, Map<String, Object> payload) {}

    @PostMapping("/start")
    public UiPathOrchestratorClient.StartJobResult start(@RequestBody StartBody body) {
        Map<String, Object> args = Map.of(
                "action", body.action(),
                "payload", body.payload() == null ? Map.of() : body.payload()
        );
        return client.startJob(args);
    }

    @GetMapping("/status/{jobKey}")
    public Map<?, ?> status(@PathVariable String jobKey) {
        return client.getJobStatus(jobKey);
    }
}

