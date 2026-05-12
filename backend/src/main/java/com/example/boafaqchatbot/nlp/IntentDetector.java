package com.example.boafaqchatbot.nlp;

import com.example.boafaqchatbot.util.TextNorm;
import org.springframework.stereotype.Component;

@Component
public class IntentDetector {

    public Intent detect(String text) {
        if (text == null) return Intent.UNKNOWN;
        text = TextNorm.norm(text);

        // RPA N1-RR (exemples: attestations, relevés, documents)
        if (text.contains("attestation") || text.contains("relev") || text.contains("document")
                || (text.contains("modifier") && text.contains("coordonn"))) {
            return Intent.RPA_N1_RR;
        }

        if (text.contains("solde") || text.contains("balance"))
            return Intent.CONSULTER_SOLDE;

        if (text.contains("ouvrir") && text.contains("compte"))
            return Intent.OUVERTURE_COMPTE;

        if (text.contains("virement") || text.contains("transfert"))
            return Intent.VIREMENT;

        if (text.contains("debloquer") && text.contains("carte"))
            return Intent.CARD_UNBLOCK;

        if (text.contains("dotation") && (text.contains("ecommerce") || text.contains("e commerce") || text.contains("internet") || text.contains("vna")))
            return Intent.DOTATION_ECOMMERCE;

        if (text.contains("dotation") && (text.contains("touristique") || text.contains("voyage")))
            return Intent.DOTATION_TOURISTIQUE;

        if (text.contains("carte") && (text.contains("bloquer") || text.contains("bloquee") || text.contains("perdu") || text.contains("vol")))
            return Intent.BLOQUER_CARTE;

        if (text.contains("carte") && (text.contains("bancaire") || text.contains("paiement") || text.contains("sans contact")))
            return Intent.CARTE_BANCAIRE;

        if (text.contains("frais") || text.contains("tarif"))
            return Intent.FRAIS;

        if (text.contains("teg") || (text.contains("taux") && text.contains("annuel") && text.contains("effectif")))
            return Intent.TEG;

        return Intent.UNKNOWN;
    }
}

