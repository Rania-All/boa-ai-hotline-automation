package com.example.boafaqchatbot.nlp;

import org.springframework.stereotype.Component;

@Component
public class IntentDetector {

    public Intent detect(String text) {
        if (text == null) return Intent.UNKNOWN;
        text = text.toLowerCase();

        // RPA N1-RR (exemples: attestations, relevés, documents, activation)
        if (text.contains("attestation") || text.contains("relev") || text.contains("document")
                || (text.contains("activer") && text.contains("carte"))
                || (text.contains("modifier") && text.contains("coordonn"))) {
            return Intent.RPA_N1_RR;
        }

        if (text.contains("solde") || text.contains("balance"))
            return Intent.CONSULTER_SOLDE;

        if (text.contains("ouvrir") && text.contains("compte"))
            return Intent.OUVERTURE_COMPTE;

        if (text.contains("virement") || text.contains("transfert"))
            return Intent.VIREMENT;

        if (text.contains("carte") && (text.contains("bloquer") || text.contains("perdu") || text.contains("vol")))
            return Intent.BLOQUER_CARTE;

        if (text.contains("carte"))
            return Intent.CARTE_BANCAIRE;

        if (text.contains("frais") || text.contains("tarif"))
            return Intent.FRAIS;

        return Intent.UNKNOWN;
    }
}

