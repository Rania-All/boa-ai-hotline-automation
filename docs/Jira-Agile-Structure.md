# Guide de Configuration du Backlog Agile sur Jira

Ce guide décrit comment configurer vos **Epics**, vos **Sprints** et vos **User Stories** sur Jira pour le projet **Automatisation de la Hotline - BOA (ALGUI Rania)**.

## 1. Liste des Epics et Dates (Calendrier global)

| ID | Nom de l'Epic | Priorité | Date Début | Date Fin | Sprints Liés | Description |
|----|---------------|----------|------------|----------|--------------|-------------|
| **EPIC-01** | Epic : Conception & Cadrage Technique | Must | 16-02-2026 | 01-03-2026 | Sprint 1 | Phases initiales de cadrage, analyse et architecture. |
| **EPIC-02** | Epic : Moteur de Chatbot & FAQ Excel | Must | 02-03-2026 | 15-03-2026 | Sprint 2 | Ingestion et API de recherche basées sur la FAQ Excel. |
| **EPIC-03** | Epic : NLP & Classification RAG / IA | Must | 16-03-2026 | 29-03-2026 | Sprint 3 | Classification intelligente IA et détection du périmètre N1-RR. |
| **EPIC-04** | Epic : Interface React & Dashboard Admin | Must | 30-03-2026 | 12-04-2026 | Sprint 4 | Développement de l'interface graphique utilisateur et administrateur. |
| **EPIC-05** | Epic : Intégration UiPath Orchestrator | Must | 13-04-2026 | 10-05-2026 | Sprint 5, Sprint 6 | Connexion sécurisée API et déclenchement de jobs robotisés. |
| **EPIC-06** | Epic : Sécurisation & Simulation Métier | Should | 11-05-2026 | 24-05-2026 | Sprint 7 | Formulaires de démo et masquage des données sensibles. |
| **EPIC-07** | Epic : Recette, Déploiement & Clôture | Must | 25-05-2026 | 14-07-2026 | Sprint 8, Phase Finale | Tests de bout en bout, correctifs et rédaction de rapport PFE. |

## 2. Détail du Backlog (User Stories)

| ID | User Story (Titre) | Epic Associé | Priorité | Sprint | Période | Critère d'acceptation |
|----|--------------------|--------------|----------|--------|---------|-----------------------|
| **US-01** | Analyse des besoins de la hotline BOA | *Epic : Conception & Cadrage Technique* | **Must** | Sprint 1 | 16-02-2026 au 22-02-2026 | Liste des processus N1-RR éligibles validée. |
| **US-02** | Mise en place de l'architecture technique | *Epic : Conception & Cadrage Technique* | **Must** | Sprint 1 | 23-02-2026 au 01-03-2026 | Workspace Git configuré, compilation ok. |
| **US-03** | Parser de base FAQ Excel | *Epic : Moteur de Chatbot & FAQ Excel* | **Must** | Sprint 2 | 02-03-2026 au 08-03-2026 | Fichier Excel parsé par Apache POI sans erreur. |
| **US-04** | API de recherche FAQ par mot-clé | *Epic : Moteur de Chatbot & FAQ Excel* | **Must** | Sprint 2 | 09-03-2026 au 15-03-2026 | Temps de réponse < 500ms sur la recherche. |
| **US-05** | Classification RAG / NLP intelligente | *Epic : NLP & Classification RAG / IA* | **Must** | Sprint 3 | 16-03-2026 au 22-03-2026 | Précision de classification > 85%. |
| **US-06** | Détection automatique de demande RPA N1-RR | *Epic : NLP & Classification RAG / IA* | **Must** | Sprint 3 | 23-03-2026 au 29-03-2026 | Les cas N1-RR sont correctement flaggés pour exécution RPA. |
| **US-07** | Interface graphique de Chat React | *Epic : Interface React & Dashboard Admin* | **Must** | Sprint 4 | 30-03-2026 au 05-04-2026 | Interface de chat responsive, bulles de messages fluides. |
| **US-08** | Base SQL d'historique des conversations | *Epic : Interface React & Dashboard Admin* | **Must** | Sprint 4 | 06-04-2026 au 12-04-2026 | Sessions de chat persistées en base PostgreSQL / H2. |
| **US-09** | Authentification OAuth2 à l'Orchestrator Cloud | *Epic : Intégration UiPath Orchestrator* | **Must** | Sprint 5 | 13-04-2026 au 26-04-2026 | Jeton bearer récupéré et rafraîchi avec client_id/secret. |
| **US-10** | API de déclenchement de job RPA | *Epic : Intégration UiPath Orchestrator* | **Must** | Sprint 6 | 27-04-2026 au 03-05-2026 | Statut 201 Created retourné avec la clé unique du job. |
| **US-11** | Suivi de statut du robot en temps réel | *Epic : Intégration UiPath Orchestrator* | **Must** | Sprint 6 | 04-05-2026 au 10-05-2026 | Polling backend fonctionnel avec statuts : In Progress / Success. |
| **US-12** | Formulaires de simulation bancaire | *Epic : Sécurisation & Simulation Métier* | **Should** | Sprint 7 | 11-05-2026 au 17-05-2026 | Validation de champs côté React, payload JSON envoyé au backend. |
| **US-13** | Masquage et sécurité des données bancaires | *Epic : Sécurisation & Simulation Métier* | **Must** | Sprint 7 | 18-05-2026 au 24-05-2026 | Masquage par regex dans les logs et la DB (ex: **** **** **** 1234). |
| **US-14** | Tests d'intégration bout en bout | *Epic : Recette, Déploiement & Clôture* | **Must** | Sprint 8 | 25-05-2026 au 07-06-2026 | Parcours complet validé avec succès sans crash. |
| **US-15** | Déploiement pilote & Rapport final PFE | *Epic : Recette, Déploiement & Clôture* | **Must** | Phase Finale | 08-06-2026 au 14-07-2026 | Rapport PFE complet validé par les encadrants. |

## 3. Comment importer ce Backlog dans Jira :
1. Ouvrez Jira Software et accédez à votre projet.
2. Allez dans les **Paramètres** (roue crantée) > **Système** > **Importation externe (CSV)** (ou dans votre Backlog > bouton **Importer via CSV**).
3. Téléchargez le fichier [jira_backlog_import.csv](file:///c:/Users/HP/Desktop/STAGE/STAGE/docs/jira_backlog_import.csv).
4. Mappez les champs Jira correspondants (Summary ➔ Résumé, Issue Type ➔ Type de ticket, Epic Link ➔ Epic, etc.).
5. Validez l'importation. Vos tickets seront créés instantanément avec leurs priorités, dates et critères !
