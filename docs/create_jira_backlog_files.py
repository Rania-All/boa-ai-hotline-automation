# -*- coding: utf-8 -*-
"""
Crée la structure agile Jira (Epics, Sprints, Backlogs) en CSV, Markdown et LaTeX.
"""
import os
import csv

# Dossier de destination
docs_dir = os.path.dirname(__file__)

# Données des tickets
tickets = [
    # EPICS
    {"ID": "EPIC-01", "Summary": "Epic : Conception & Cadrage Technique", "Issue Type": "Epic", "Priority": "Must", "Sprint": "Sprint 1", "Start": "16-02-2026", "End": "01-03-2026", "Description": "Phases initiales de cadrage, analyse et architecture.", "Acceptance": "- Doc d'architecture validé\n- Workspace de dev initialisé"},
    {"ID": "EPIC-02", "Summary": "Epic : Moteur de Chatbot & FAQ Excel", "Issue Type": "Epic", "Priority": "Must", "Sprint": "Sprint 2", "Start": "02-03-2026", "End": "15-03-2026", "Description": "Ingestion et API de recherche basées sur la FAQ Excel.", "Acceptance": "- Excel parsé avec succès\n- Recherche FAQ opérationnelle"},
    {"ID": "EPIC-03", "Summary": "Epic : NLP & Classification RAG / IA", "Issue Type": "Epic", "Priority": "Must", "Sprint": "Sprint 3", "Start": "16-03-2026", "End": "29-03-2026", "Description": "Classification intelligente IA et détection du périmètre N1-RR.", "Acceptance": "- Taux de précision > 85%\n- Détection automatique RPA ok"},
    {"ID": "EPIC-04", "Summary": "Epic : Interface React & Dashboard Admin", "Issue Type": "Epic", "Priority": "Must", "Sprint": "Sprint 4", "Start": "30-03-2026", "End": "12-04-2026", "Description": "Développement de l'interface graphique utilisateur et administrateur.", "Acceptance": "- Chat UI responsive\n- Page historique opérationnelle"},
    {"ID": "EPIC-05", "Summary": "Epic : Intégration UiPath Orchestrator", "Issue Type": "Epic", "Priority": "Must", "Sprint": "Sprint 5, Sprint 6", "Start": "13-04-2026", "End": "10-05-2026", "Description": "Connexion sécurisée API et déclenchement de jobs robotisés.", "Acceptance": "- OAuth2 fonctionnel\n- Lancement robot via API Rest"},
    {"ID": "EPIC-06", "Summary": "Epic : Sécurisation & Simulation Métier", "Issue Type": "Epic", "Priority": "Should", "Sprint": "Sprint 7", "Start": "11-05-2026", "End": "24-05-2026", "Description": "Formulaires de démo et masquage des données sensibles.", "Acceptance": "- Simulation de virement\n- Pas de données sensibles en clair"},
    {"ID": "EPIC-07", "Summary": "Epic : Recette, Déploiement & Clôture", "Issue Type": "Epic", "Priority": "Must", "Sprint": "Sprint 8, Phase Finale", "Start": "25-05-2026", "End": "14-07-2026", "Description": "Tests de bout en bout, correctifs et rédaction de rapport PFE.", "Acceptance": "- Test end-to-end ok\n- Rapport final validé"},
    
    # USER STORIES
    # Epic 1
    {"ID": "US-01", "Summary": "Analyse des besoins de la hotline BOA", "Issue Type": "Story", "Priority": "Must", "Sprint": "Sprint 1", "Start": "16-02-2026", "End": "22-02-2026", "Epic Link": "Epic : Conception & Cadrage Technique", "Description": "En tant que développeuse, je veux analyser les besoins de la hotline afin de définir le périmètre fonctionnel.", "Acceptance": "Liste des processus N1-RR éligibles validée."},
    {"ID": "US-02", "Summary": "Mise en place de l'architecture technique", "Issue Type": "Story", "Priority": "Must", "Sprint": "Sprint 1", "Start": "23-02-2026", "End": "01-03-2026", "Epic Link": "Epic : Conception & Cadrage Technique", "Description": "En tant que développeuse, je veux initialiser les projets Spring Boot et React afin de démarrer le développement.", "Acceptance": "Workspace Git configuré, compilation ok."},
    
    # Epic 2
    {"ID": "US-03", "Summary": "Parser de base FAQ Excel", "Issue Type": "Story", "Priority": "Must", "Sprint": "Sprint 2", "Start": "02-03-2026", "End": "08-03-2026", "Epic Link": "Epic : Moteur de Chatbot & FAQ Excel", "Description": "En tant que conseiller, je veux que la base de données charge le fichier Excel pour l'exploiter en continu.", "Acceptance": "Fichier Excel parsé par Apache POI sans erreur."},
    {"ID": "US-04", "Summary": "API de recherche FAQ par mot-clé", "Issue Type": "Story", "Priority": "Must", "Sprint": "Sprint 2", "Start": "09-03-2026", "End": "15-03-2026", "Epic Link": "Epic : Moteur de Chatbot & FAQ Excel", "Description": "En tant que conseiller, je veux rechercher une question par mot-clé afin d'avoir une réponse instantanée.", "Acceptance": "Temps de réponse < 500ms sur la recherche."},

    # Epic 3
    {"ID": "US-05", "Summary": "Classification RAG / NLP intelligente", "Issue Type": "Story", "Priority": "Must", "Sprint": "Sprint 3", "Start": "16-03-2026", "End": "22-03-2026", "Epic Link": "Epic : NLP & Classification RAG / IA", "Description": "En tant que responsable, je veux classifier les questions pour répondre intelligemment via similarité sémantique.", "Acceptance": "Précision de classification > 85%."},
    {"ID": "US-06", "Summary": "Détection automatique de demande RPA N1-RR", "Issue Type": "Story", "Priority": "Must", "Sprint": "Sprint 3", "Start": "23-03-2026", "End": "29-03-2026", "Epic Link": "Epic : NLP & Classification RAG / IA", "Description": "En tant que responsable support, je veux que l'IA détecte si la question doit être traitée par un robot.", "Acceptance": "Les cas N1-RR sont correctement flaggés pour exécution RPA."},

    # Epic 4
    {"ID": "US-07", "Summary": "Interface graphique de Chat React", "Issue Type": "Story", "Priority": "Must", "Sprint": "Sprint 4", "Start": "30-03-2026", "End": "05-04-2026", "Epic Link": "Epic : Interface React & Dashboard Admin", "Description": "En tant qu'utilisateur, je veux interagir avec une interface de chat agréable pour poser mes questions.", "Acceptance": "Interface de chat responsive, bulles de messages fluides."},
    {"ID": "US-08", "Summary": "Base SQL d'historique des conversations", "Issue Type": "Story", "Priority": "Must", "Sprint": "Sprint 4", "Start": "06-04-2026", "End": "12-04-2026", "Epic Link": "Epic : Interface React & Dashboard Admin", "Description": "En tant qu'administrateur, je veux sauvegarder les chats afin de garder une traçabilité des incidents.", "Acceptance": "Sessions de chat persistées en base PostgreSQL / H2."},

    # Epic 5
    {"ID": "US-09", "Summary": "Authentification OAuth2 à l'Orchestrator Cloud", "Issue Type": "Story", "Priority": "Must", "Sprint": "Sprint 5", "Start": "13-04-2026", "End": "26-04-2026", "Epic Link": "Epic : Intégration UiPath Orchestrator", "Description": "En tant que développeuse, je veux gérer l'authentification OAuth2 pour appeler de façon sécurisée l'API UiPath.", "Acceptance": "Jeton bearer récupéré et rafraîchi avec client_id/secret."},
    {"ID": "US-10", "Summary": "API de déclenchement de job RPA", "Issue Type": "Story", "Priority": "Must", "Sprint": "Sprint 6", "Start": "27-04-2026", "End": "03-05-2026", "Epic Link": "Epic : Intégration UiPath Orchestrator", "Description": "En tant que responsable, je veux lancer un robot UiPath à partir d'un appel API HTTP.", "Acceptance": "Statut 201 Created retourné avec la clé unique du job."},
    {"ID": "US-11", "Summary": "Suivi de statut du robot en temps réel", "Issue Type": "Story", "Priority": "Must", "Sprint": "Sprint 6", "Start": "04-05-2026", "End": "10-05-2026", "Epic Link": "Epic : Intégration UiPath Orchestrator", "Description": "En tant qu'agent, je veux voir l'avancement du robot afin de suivre la résolution.", "Acceptance": "Polling backend fonctionnel avec statuts : In Progress / Success."},

    # Epic 6
    {"ID": "US-12", "Summary": "Formulaires de simulation bancaire", "Issue Type": "Story", "Priority": "Should", "Sprint": "Sprint 7", "Start": "11-05-2026", "End": "17-05-2026", "Epic Link": "Epic : Sécurisation & Simulation Métier", "Description": "En tant que développeuse, je veux simuler des formulaires (virements, blocages) pour valider l'envoi au robot.", "Acceptance": "Validation de champs côté React, payload JSON envoyé au backend."},
    {"ID": "US-13", "Summary": "Masquage et sécurité des données bancaires", "Issue Type": "Story", "Priority": "Must", "Sprint": "Sprint 7", "Start": "18-05-2026", "End": "24-05-2026", "Epic Link": "Epic : Sécurisation & Simulation Métier", "Description": "En tant que responsable sécurité, je veux masquer les cartes et identifiants dans les logs.", "Acceptance": "Masquage par regex dans les logs et la DB (ex: **** **** **** 1234)."},

    # Epic 7
    {"ID": "US-14", "Summary": "Tests d'intégration bout en bout", "Issue Type": "Story", "Priority": "Must", "Sprint": "Sprint 8", "Start": "25-05-2026", "End": "07-06-2026", "Epic Link": "Epic : Recette, Déploiement & Clôture", "Description": "En tant que développeuse, je veux tester le flux complet (User ➔ Chatbot ➔ IA ➔ UiPath ➔ Client) pour corriger les bugs.", "Acceptance": "Parcours complet validé avec succès sans crash."},
    {"ID": "US-15", "Summary": "Déploiement pilote & Rapport final PFE", "Issue Type": "Story", "Priority": "Must", "Sprint": "Phase Finale", "Start": "08-06-2026", "End": "14-07-2026", "Epic Link": "Epic : Recette, Déploiement & Clôture", "Description": "En tant qu'étudiante, je veux déployer le pilote et rédiger mon rapport de PFE pour la soutenance.", "Acceptance": "Rapport PFE complet validé par les encadrants."}
]

# 1. Générer le fichier CSV
csv_path = os.path.join(docs_dir, 'jira_backlog_import.csv')
with open(csv_path, mode='w', encoding='utf-8-sig', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(["Issue Key (ID)", "Summary", "Issue Type", "Priority", "Sprint", "Epic Link/Name", "Start Date", "End Date", "Description", "Acceptance Criteria"])
    for t in tickets:
        epic_lnk = t.get("Epic Link", "")
        # Pour les Epics, la colonne Epic Link est son propre nom d'Epic dans Jira
        if t["Issue Type"] == "Epic":
            epic_lnk = t["Summary"]
        writer.writerow([
            t["ID"],
            t["Summary"],
            t["Issue Type"],
            t["Priority"],
            t["Sprint"],
            epic_lnk,
            t["Start"],
            t["End"],
            t["Description"],
            t["Acceptance"]
        ])

print("Fichier CSV Jira généré :", csv_path)

# 2. Générer le guide Markdown
md_path = os.path.join(docs_dir, 'Jira-Agile-Structure.md')
with open(md_path, mode='w', encoding='utf-8') as f:
    f.write("# Guide de Configuration du Backlog Agile sur Jira\n\n")
    f.write("Ce guide décrit comment configurer vos **Epics**, vos **Sprints** et vos **User Stories** sur Jira pour le projet **Automatisation de la Hotline - BOA (ALGUI Rania)**.\n\n")
    
    f.write("## 1. Liste des Epics et Dates (Calendrier global)\n\n")
    f.write("| ID | Nom de l'Epic | Priorité | Date Début | Date Fin | Sprints Liés | Description |\n")
    f.write("|----|---------------|----------|------------|----------|--------------|-------------|\n")
    for t in tickets:
        if t["Issue Type"] == "Epic":
            f.write(f"| **{t['ID']}** | {t['Summary']} | {t['Priority']} | {t['Start']} | {t['End']} | {t['Sprint']} | {t['Description']} |\n")
            
    f.write("\n## 2. Détail du Backlog (User Stories)\n\n")
    f.write("| ID | User Story (Titre) | Epic Associé | Priorité | Sprint | Période | Critère d'acceptation |\n")
    f.write("|----|--------------------|--------------|----------|--------|---------|-----------------------|\n")
    for t in tickets:
        if t["Issue Type"] == "Story":
            f.write(f"| **{t['ID']}** | {t['Summary']} | *{t['Epic Link']}* | **{t['Priority']}** | {t['Sprint']} | {t['Start']} au {t['End']} | {t['Acceptance']} |\n")

    f.write("\n## 3. Comment importer ce Backlog dans Jira :\n")
    f.write("1. Ouvrez Jira Software et accédez à votre projet.\n")
    f.write("2. Allez dans les **Paramètres** (roue crantée) > **Système** > **Importation externe (CSV)** (ou dans votre Backlog > bouton **Importer via CSV**).\n")
    f.write("3. Téléchargez le fichier [jira_backlog_import.csv](file:///c:/Users/HP/Desktop/STAGE/STAGE/docs/jira_backlog_import.csv).\n")
    f.write("4. Mappez les champs Jira correspondants (Summary ➔ Résumé, Issue Type ➔ Type de ticket, Epic Link ➔ Epic, etc.).\n")
    f.write("5. Validez l'importation. Vos tickets seront créés instantanément avec leurs priorités, dates et critères !\n")

print("Fichier Markdown Jira généré :", md_path)

# 3. Générer le fichier LaTeX
tex_path = os.path.join(docs_dir, 'Jira-Agile-Structure.tex')
with open(tex_path, mode='w', encoding='utf-8') as f:
    f.write("% --- SOUS-SECTION : STRUCTURE AGILE JIRA ---\n")
    f.write("\\subsection{Structure du Backlog Agile : Epics et Sprints}\n")
    f.write("\\label{subsec:structure_backlog_jira}\n\n")
    f.write("Pour piloter notre projet d'automatisation sur Jira, nous avons découpé le projet en sept grandes thématiques (Epics) représentant les jalons techniques principaux. Le tableau~\\ref{tab:epics_jira} résume ces Epics ainsi que leur planification chronologique.\n\n")
    
    # Table Epics
    f.write("\\begin{table}[htbp]\n\\centering\n\\small\n")
    f.write("\\begin{tabular}{|l|p{4.5cm}|c|c|c|p{3.5cm}|}\n\\hline\n")
    f.write("\\textbf{ID} & \\textbf{Nom de l'Epic} & \\textbf{Prio.} & \\textbf{Début} & \\textbf{Fin} & \\textbf{Description} \\\\ \\hline\n")
    for t in tickets:
        if t["Issue Type"] == "Epic":
            f.write(f"{t['ID']} & {t['Summary'].replace('Epic : ', '')} & {t['Priority']} & {t['Start']} & {t['End']} & {t['Description']} \\\\ \\hline\n")
    f.write("\\end{tabular}\n")
    f.write("\\caption{Structure des Epics du Projet sur Jira}\n")
    f.write("\\label{tab:epics_jira}\n\\end{table}\n\n")
    
    f.write("Le backlog détaillé, constitué de récits utilisateurs (User Stories) rattachés à chaque Epic avec leur priorité (Must/Should) et leur période de réalisation, est présenté dans le tableau~\\ref{tab:stories_jira}.\n\n")
    
    # Table Stories
    f.write("\\begin{table}[htbp]\n\\centering\n\\scriptsize\n")
    f.write("\\begin{tabular}{|l|p{3.5cm}|p{3.5cm}|c|c|p{3.5cm}|}\n\\hline\n")
    f.write("\\textbf{ID} & \\textbf{Titre de la Story} & \\textbf{Epic Parent} & \\textbf{Prio.} & \\textbf{Sprint} & \\textbf{Critère d'acceptation} \\\\ \\hline\n")
    for t in tickets:
        if t["Issue Type"] == "Story":
            epic_clean = t['Epic Link'].replace('Epic : ', '')
            f.write(f"{t['ID']} & {t['Summary']} & {epic_clean} & {t['Priority']} & {t['Sprint']} & {t['Acceptance']} \\\\ \\hline\n")
    f.write("\\end{tabular}\n")
    f.write("\\caption{Backlog Détaillé des User Stories du Projet}\n")
    f.write("\\label{tab:stories_jira}\n\\end{table}\n")

print("Fichier LaTeX Jira généré :", tex_path)
