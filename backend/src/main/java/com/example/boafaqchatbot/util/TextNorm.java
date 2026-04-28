package com.example.boafaqchatbot.util;

import java.text.Normalizer;

public class TextNorm {

    public static String norm(String s) {
        if (s == null) return "";
        s = s.toLowerCase();
        s = Normalizer.normalize(s, Normalizer.Form.NFD);
        s = s.replaceAll("\\p{M}", "");
        s = s.replaceAll("[^a-z0-9 ]", " ");
        s = s.replaceAll("\\s+", " ").trim();
        return normalizeSynonyms(s);
    }

    private static String normalizeSynonyms(String s) {
        // Simple synonym mapping to improve matching across 84 questions
        return s.replace("duree", "delai")
                .replace("temps", "delai")
                .replace("tarif", "frais")
                .replace("prix", "frais")
                .replace("cout", "frais")
                .replace("commission", "frais")
                .replace("balance", "solde")
                .replace("avoir", "solde")
                .replace("transfert", "virement")
                .replace("envoi", "virement")
                .replace("deverrouiller", "debloquer")
                .replace("reactiver", "debloquer")
                .replace("verrouiller", "bloquer")
                .replace("suspendre", "bloquer")
                .replace("creation", "ouverture")
                .replace("souscription", "ouverture")
                .replace("identite", "cin");
    }
}

