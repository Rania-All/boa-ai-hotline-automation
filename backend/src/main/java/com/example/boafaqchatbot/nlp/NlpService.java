package com.example.boafaqchatbot.nlp;

import org.springframework.stereotype.Service;

@Service
public class NlpService {

    private final IntentDetector detector;

    public NlpService(IntentDetector detector) {
        this.detector = detector;
    }

    public Intent detectIntent(String message) {
        return detector.detect(message);
    }
}

