# -*- coding: utf-8 -*-
"""
Génère le diagramme des 8 Sprints du projet (16 Février - 14 Juillet)
"""
import os
import matplotlib.pyplot as plt
import pandas as pd
from datetime import datetime

# Données des 8 Sprints + Phase finale de clôture
data = [
    {"Task": "Sprint 1 : Spécifications & Architecture", "Start": "2026-02-16", "End": "2026-03-01", "Color": "#475569", "Type": "Conception"},
    {"Task": "Sprint 2 : Socle Backend & Ingestion FAQ", "Start": "2026-03-02", "End": "2026-03-15", "Color": "#3b82f6", "Type": "Dév Chatbot"},
    {"Task": "Sprint 3 : NLP & Classification RAG/IA", "Start": "2026-03-16", "End": "2026-03-29", "Color": "#4f46e5", "Type": "Dév Chatbot"},
    {"Task": "Sprint 4 : Interface React & Dashboard", "Start": "2026-03-30", "End": "2026-04-12", "Color": "#6366f1", "Type": "UI"},
    {"Task": "Sprint 5 : Connexion UiPath Orchestrator", "Start": "2026-04-13", "End": "2026-04-26", "Color": "#8b5cf6", "Type": "RPA"},
    {"Task": "Sprint 6 : Déclenchement & Suivi RPA", "Start": "2026-04-27", "End": "2026-05-10", "Color": "#7c3aed", "Type": "RPA"},
    {"Task": "Sprint 7 : Simulation Métier & Sécurité", "Start": "2026-05-11", "End": "2026-05-24", "Color": "#db2777", "Type": "Sécurité"},
    {"Task": "Sprint 8 : Recette Globale & Correctifs", "Start": "2026-05-25", "End": "2026-06-07", "Color": "#0d9488", "Type": "Validation"},
    {"Task": "Phase Finale : Déploiement & Rapport PFE", "Start": "2026-06-08", "End": "2026-07-14", "Color": "#10b981", "Type": "Clôture"}
]

df = pd.DataFrame(data)
df['Start'] = pd.to_datetime(df['Start'])
df['End'] = pd.to_datetime(df['End'])

# Création du graphique
fig, ax = plt.subplots(figsize=(13, 7.5), dpi=300)

# Style de fond
fig.patch.set_facecolor('#ffffff')
ax.set_facecolor('#f8fafc')

# Affichage des barres horizontales
for i, row in df.iterrows():
    duration = (row['End'] - row['Start']).days + 1
    ax.barh(row['Task'], duration, left=row['Start'], color=row['Color'], edgecolor='none', height=0.55)
    # Ajouter le nombre de jours/semaines sur la barre
    label_text = f"{duration}j (~3 sem.)" if i == 8 else f"{duration}j (2 sem.)"
    ax.text(row['Start'] + (row['End'] - row['Start'])/2, i, label_text,
            ha='center', va='center', color='white', fontweight='bold', fontsize=9)

# Titres
ax.set_xlabel("Période de réalisation (16 Février - 14 Juillet)", labelpad=15, fontsize=12, fontweight='bold', color='#1e293b')
ax.set_title("Planning de Réalisation - 8 Sprints & Phase Finale", fontsize=15, fontweight='bold', color='#1e293b', pad=25)

# Définition des étiquettes des mois en français
months_starts = [
    datetime(2026, 2, 16),
    datetime(2026, 3, 1),
    datetime(2026, 4, 1),
    datetime(2026, 5, 1),
    datetime(2026, 6, 1),
    datetime(2026, 7, 1),
    datetime(2026, 7, 14)
]
months_labels = [
    "16 Fév",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "14 Juil"
]

ax.set_xticks(months_starts)
ax.set_xticklabels(months_labels, fontsize=10, fontweight='bold', color='#475569')

# Limites de l'axe des abscisses
ax.set_xlim(datetime(2026, 2, 10), datetime(2026, 7, 20))

# Grille
ax.xaxis.grid(True, linestyle='--', alpha=0.5, color='#cbd5e1')
ax.yaxis.grid(False)

# Supprimer les bordures
for spine in ['top', 'right', 'left', 'bottom']:
    ax.spines[spine].set_visible(False)

# Inverser l'axe Y
plt.gca().invert_yaxis()

# Formater les étiquettes de l'axe Y
plt.yticks(fontsize=10.5, fontweight='bold', color='#334155')

plt.tight_layout()

# Sauvegarde
out = os.path.join(os.path.dirname(__file__), 'sprints_timeline.png')
plt.savefig(out, facecolor=fig.get_facecolor(), bbox_inches='tight')
print("Diagramme généré avec succès dans :", out)
