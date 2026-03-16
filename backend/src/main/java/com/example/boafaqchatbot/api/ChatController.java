package com.example.boafaqchatbot.api;

import com.example.boafaqchatbot.service.ChatService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@Validated
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    public record AskBody(@NotBlank String question, String sessionId) {}

    @PostMapping("/ask")
    public ChatService.ChatResponse ask(@Valid @RequestBody AskBody body) {
        return chatService.reply(body.question(), body.sessionId());
    }
}

