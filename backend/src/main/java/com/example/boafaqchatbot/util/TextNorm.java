package com.example.boafaqchatbot.util;

import java.text.Normalizer;

public class TextNorm {

    public static String norm(String s) {
        if (s == null) return "";
        s = s.toLowerCase();
        s = Normalizer.normalize(s, Normalizer.Form.NFD);
        s = s.replaceAll("\\p{M}", "");
        s = s.replaceAll("[^a-z0-9 ]", " ");
        return s.replaceAll("\\s+", " ").trim();
    }
}

