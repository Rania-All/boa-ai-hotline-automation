# Chapitre 2 : Cadre Méthodologique et Planification du Projet

**Étudiante :** ALGUI Rania  
**Projet :** Automatisation de la Hotline (BOA)  
**Établissement :** EMSI (École Marocaine des Sciences de l'Ingénieur)  
**Logos :** `emsi_logo.png`, `EAF.png`

---

### 2.2.1 Les rôles Scrum

Les rôles de la méthodologie Scrum sont :
— Scrum Master : Le responsable du déroulement du processus. Il garantit l’efficacité de la collaboration entre les membres de l’équipe.
— Product Owner : Le représentant du client. Il détermine ce qui doit être réalisé.
— Team : Les développeurs chargés de la construction du logiciel et d’en faire une démonstration.

Dans le cadre de notre projet au sein de l'équipe IPA Factory, ces rôles ont été répartis comme suit :
* **Product Owner :** Ce rôle est assuré par **M. Abdelouadoud CHAALI** (Chef de l’équipe IPA Factory et encadrant professionnel), qui détermine le périmètre fonctionnel du projet pour la Hotline BOA et valide sa conformité.
* **Scrum Master :** Ce rôle de facilitation est assuré par :
  * **ALGUI Rania** (l'étudiante), pour le suivi méthodologique de ses propres sprints.
  * **M. Hamza JANATE** (sous-encadrant), pour l'accompagnement quotidien, ses conseils et son aide à la résolution des obstacles techniques.
  * **M. Mouhanad EL FILALI** (encadrant pédagogique), pour le suivi régulier et les conseils de structuration globale.
* **Team :** Ce rôle est principalement porté par **ALGUI Rania** pour le développement du logiciel et les démonstrations de fin de sprint, en étroite collaboration sur les aspects techniques avec **Othmane KODDAM** et **Hajar ZARRIQ** (membres de l'équipe IPA Factory).


### 2.2.2 Les réunions du processus Scrum

La méthodologie SCRUM est composée de quatre réunions :
— Planification du Sprint : La planification du sprint correspond à la réalisation d’un plan de sprint ou de release selon la capacité de la vélocité de l’équipe au listing des histoires utilisateurs prioritaires que l’équipe pense pouvoir réaliser au cours d’un sprint.
— Revue de Sprint : La revue du sprint a lieu en fin de sprint, l’équipe de développement présente les fonctionnalités terminées au cours du sprint et recueille les retours du représentant des utilisateurs finaux, c’est aussi à ce moment que la mise en place des prochains sprints peut être anticipée.
— Rétrospective de Sprint : La rétrospective de Sprint permet de faire un point sur le sprint en lui-même (productivité, efficacité, qualité...) afin de pouvoir s’améliorer pour les prochains sprints.
— Mêlée quotidienne : C’est une réunion quotidienne de 15 minutes qui permet au Scrum Master de faire le point sur le travail concernant les items du sprint en cours.

Afin de structurer le déroulement de ce projet, les tâches ont été planifiées sur une période allant de Février à Juin. Ce planning global est subdivisé en huit sprints de deux semaines chacun.

<!-- Les figures ci-dessous (commentées car non disponibles) représentaient la chronologie des Sprints et le tableau Kanban sur Jira.
![Planning des Sprints - ALGUI Rania](file:///c:/Users/HP/Desktop/STAGE/STAGE/docs/sprints_timeline.png)
*(Le tableau Kanban ci-dessous montre un exemple de suivi de nos tickets de Sprint Backlog sur Jira :)*
![Suivi Sprint Backlog sur Jira](file:///c:/Users/HP/Desktop/STAGE/STAGE/docs/jira_scrum_board.png)
-->

#### 2.2.1.1 Déroulement pratique des rites Scrum : Exemple du Sprint 3

Bien que ce projet de fin d'études ait été réalisé de façon individuelle, les rites Scrum ont été simulés et appliqués rigoureusement afin de structurer le déroulement des tâches et d'assurer une communication fluide avec l'encadrement. 

Pour illustrer cette démarche, nous présentons ci-dessous le déroulement des quatre cérémonies Scrum lors du **Sprint 3** (du 16 au 29 Mars), qui a porté sur le développement du module d'intelligence artificielle (RAG/NLP) et la classification des requêtes.

1. **Planification du Sprint 3 (Sprint Planning) :**
   * **Date & Durée :** 16 Mars 2026 (2 heures)
   * **Participants :** ALGUI Rania (Développeuse / Scrum Master), Encadrant professionnel BOA (Product Owner).
   * **Objectif du Sprint :** Mettre en place la classification automatique des requêtes par IA et l'API de recherche FAQ.
   * **Contenu de la réunion :** Analyse du Product Backlog et estimation de l'effort de développement. Les User Stories suivantes ont été sélectionnées :
     * **US-06** (Classification N1-RR par IA) : Estimée à 8 Story Points (effort important lié à l'intégration du NLP/RAG).
     * **US-07** (Recherche FAQ en langage naturel) : Estimée à 5 Story Points (s'appuyant sur les données déjà structurées).
   * **Engagement :** L'équipe s'est engagée sur une vélocité totale de **13 Story Points**. Les tâches techniques ont été découpées et assignées sur Jira.

2. **Mêlée quotidienne (Daily Scrum) :**
   * **Date & Durée :** 23 Mars 2026 (15 minutes)
   * **Participants :** ALGUI Rania (Développeuse).
   * **Contenu de la réunion (Auto-suivi) :**
     * *Travail réalisé la veille :* Finalisation du script Python de recherche sémantique sur la base FAQ Excel.
     * *Travail prévu pour la journée :* Création de l'API REST dans le backend Spring Boot pour l'intégrer au chatbot.
     * *Obstacles rencontrés :* Lenteurs de chargement du modèle sémantique lors des premières requêtes. Solution retenue : optimiser la mise en cache des embeddings.

3. **Revue de Sprint 3 (Sprint Review) :**
   * **Date & Durée :** 28 Mars 2026 (1 heure)
   * **Participants :** ALGUI Rania (Développeuse), Encadrant BOA (Product Owner), Conseillers Hotline BOA (Utilisateurs pilotes).
   * **Contenu de la réunion :** Démonstration des fonctionnalités terminées du chatbot. Saisie en direct de la question : *« Comment réinitialiser le mot de passe BOA-Net ? »*. Le chatbot a correctement identifié la panne comme N1-RR et retourné la solution FAQ en moins d'une seconde.
   * **Décision :** Le Product Owner a validé les critères d'acceptation et a marqué les US-06 et US-07 comme « Terminées » (Done).

4. **Rétrospective de Sprint 3 (Sprint Retrospective) :**
   * **Date & Durée :** 29 Mars 2026 (45 minutes)
   * **Participants :** ALGUI Rania (Développeuse).
   * **Contenu de la réunion (Bilan méthodologique) :**
     * *Points positifs :* Le nettoyage initial des données FAQ au Sprint 1 a considérablement accéléré le développement de la recherche NLP.
     * *Points à améliorer :* Perte de temps sur les configurations proxy pour contacter l'Orchestrator UiPath (anticipation du Sprint 5).
     * *Action corrective pour le Sprint 4 :* Ouvrir les accès et tester la connectivité réseau avec le service informatique dès le début du prochain sprint.

---

### 2.2.3 Product backlog

Le Product backlog correspond à une liste priorisée des besoins et des exigences du client. Les éléments du backlog de produit, appelés aussi les histoires utilisateurs (*User Stories*), sont formulés en une ou deux phrases décrivant de manière claire et précise la fonctionnalité désirée par le client, généralement écrit sous la forme :  
`« En tant que [Acteur], je veux [Fonctionnalité], afin de [Bénéfice] »`.

Dans le cadre de la mise en œuvre itérative et agile de ce projet de fin d’études, le tableau ci-dessous présente le backlog produit pour organiser et prioriser les différentes fonctionnalités à développer. Ce backlog prend la forme d’User Stories, qui décrivent les attentes des divers acteurs du système (développeuse, robot, responsable support, etc.) ainsi que les fonctionnalités qui y sont liées. Chaque User Story est également dotée d’une priorité (Must / Should), d’un sprint de réalisation, et d’un critère d’acceptation pour assurer une validation efficace.

Ce découpage nous aide à structurer les deux grandes missions du projet :
1. **La supervision intelligente des applications via RPA** (intégration UiPath).
2. **L’analyse des tickets IT enrichie par l’IA** (chatbot + RAG/NLP).

#### Tableau 2.1 : Product Backlog du Projet (User Stories)

| ID | Mission | Rôle | Description (User Story) | Priorité | Sprint | Critère d'acceptation |
|----|---------|------|--------------------------|----------|--------|-----------------------|
| **US-01** | Cadrage | Développeuse | En tant que développeuse, je veux analyser les cas d'usage de la hotline afin de définir le périmètre des requêtes éligibles à l'automatisation. | **Must** | Sprint 1 | La liste des pannes N1-RR et N2 est rédigée et validée. |
| **US-02** | Cadrage | Développeuse | En tant que développeuse, je veux me former sur UiPath afin de maîtriser les outils nécessaires au développement des robots RPA. | **Must** | Sprint 1 | Cours UiPath Academy validés. |
| **US-03** | Cadrage | Développeuse | En tant que développeuse, je veux nettoyer et structurer les données historiques de la hotline afin de construire une base FAQ Excel de qualité. | **Should** | Sprint 1 | Fichier Excel structuré sans doublons. |
| **US-04** | Cadrage | Développeuse | En tant que développeuse, je veux concevoir l'architecture Spring Boot et React afin de poser des bases techniques solides pour l'application. | **Must** | Sprint 2 | Projets initialisés sur Git, compilation ok. |
| **US-05** | Cadrage | Responsable Support | En tant que responsable support, je veux définir les flux de décision pour les pannes N1-RR afin de préparer les spécifications fonctionnelles du robot. | **Must** | Sprint 2 | Diagrammes de flux fonctionnels validés. |
| **US-06** | Analyse IA | Conseiller Hotline | En tant que conseiller, je veux que le chatbot classifie automatiquement ma demande afin d'obtenir soit une réponse FAQ directe, soit de lancer un robot. | **Must** | Sprint 3 | Module RAG/NLP isolant les cas N1-RR avec précision > 85%. |
| **US-07** | Analyse IA | Conseiller Hotline | En tant que conseiller, je veux poser des questions en langage naturel afin d'obtenir des réponses instantanées de la FAQ Excel. | **Must** | Sprint 3 | API FAQ opérationnelle avec temps de réponse < 1s. |
| **US-08** | Analyse IA | Responsable Support | En tant que responsable support, je veux que l'application intègre un moteur de décision automatique afin d'orienter l'utilisateur vers la bonne solution. | **Must** | Sprint 4 | Moteur de décision backend fonctionnel selon le type de panne. |
| **US-09** | Analyse IA | Développeuse | En tant que développeuse, je veux écrire des tests unitaires sur le backend afin de garantir la stabilité et la qualité du code. | **Should** | Sprint 4 | Couverture de test du moteur de décision > 70%. |
| **US-10** | Supervision RPA | Développeuse | En tant que développeuse, je veux implémenter l'authentification OAuth2 sécurisée afin de permettre à l'application de communiquer avec l'Orchestrator. | **Must** | Sprint 5 | Token bearer récupéré et renouvelé automatiquement. |
| **US-11** | Supervision RPA | Responsable Support | En tant que responsable, je veux que le chatbot déclenche automatiquement le robot UiPath via l'API afin de résoudre la panne N1-RR immédiatement. | **Must** | Sprint 6 | Requête POST StartJob retournant un job_key unique. |
| **US-12** | Supervision RPA | Développeuse | En tant que développeuse, je veux tester l'intégration et journaliser les statuts des robots afin de suivre et déboguer les exécutions en cas d'erreur. | **Should** | Sprint 6 | Polling de statut fonctionnel avec logs persistés en base. |
| **US-13** | Sécurité | Responsable Sécurité | En tant que responsable sécurité, je veux que les données sensibles soient masquées dans l'UI et les logs afin de garantir la conformité bancaire. | **Must** | Sprint 7 | Données confidentielles (ex: cartes) masquées automatiquement. |
| **US-14** | Simulation | Développeuse | En tant que développeuse, je veux disposer d'un simulateur de virement/blocage afin de valider l'envoi de données au robot RPA. | **Should** | Sprint 7 | Formulaires de simulation fonctionnels en React. |
| **US-15** | Recette | Conseiller Hotline | En tant que conseiller, je veux tester l'application en conditions réelles afin de valider son ergonomie et son bon fonctionnement. | **Must** | Sprint 8 | Recette utilisateur (UAT) validée sans bug bloquant. |
| **US-16** | Clôture | Développeuse | En tant que développeuse, je veux rédiger la documentation technique complète afin de faciliter la maintenance et l'évolution de la solution. | **Must** | Sprint 8 | Guide d'installation et d'administration livré. |

---

### 2.2.4 Planification des sprints

Afin de mener à bien ce projet dans le respect des délais et des contraintes de qualité, nous avons adopté la méthodologie Agile Scrum. Le projet est découpé en **huit sprints** distincts d’une durée de **deux semaines chacun**, s’étalant sur une période globale de **seize semaines (quatre mois)** du **16 Février au 14 Juillet** (la période restante étant allouée à la phase finale de déploiement, recette utilisateur et rédaction du rapport de PFE).

Le tableau 2.2 détaille cette planification ainsi que les objectifs, les activités clés et les livrables associés à chaque sprint. Cette approche itérative nous permet de suivre de manière rigoureuse la transition entre les phases d’analyse et de conception, de développement du cœur backend et de l’intelligence artificielle, d’intégration avec l’environnement RPA d’UiPath, et enfin de validation utilisateur avant la livraison de la solution finale.

#### Tableau 2.2 : Planification Détaillée des Sprints (16 Février - 14 Juillet)

| Sprint | Période | Objectifs du Sprint | Activités Clés | Livrables |
|--------|---------|---------------------|----------------|-----------|
| **Sprint 1** | 16 Fév – 01 Mar | Cadrage, spécifications et formation. | Analyse des besoins de la hotline BOA ; formation UiPath Academy ; nettoyage des données. | Liste des cas d'usage validée ; environnement configuré. |
| **Sprint 2** | 02 Mar – 15 Mar | Ingestion de la base FAQ et architecture. | Conception de l'architecture technique ; initialisation Spring Boot et React ; définition des flux. | Projets initialisés sur Git ; diagrammes de flux validés. |
| **Sprint 3** | 16 Mar – 29 Mar | Intégration du module d'IA et classification. | Développement du traitement RAG/NLP ; classification des requêtes N1-RR ; API REST de recherche FAQ. | Module de classification IA prêt ; API FAQ opérationnelle. |
| **Sprint 4** | 30 Mar – 12 Avr | Moteur de décision et tests unitaires. | Implémentation du moteur de décision backend ; écriture des tests unitaires sur le backend. | Moteur de décision fonctionnel ; couverture de test > 70%. |
| **Sprint 5** | 13 Avr – 26 Avr | Connexion et authentification Orchestrator. | Implémentation du protocole d'authentification OAuth2 (Client Credentials) ; client HTTP de connexion UiPath. | Module d'authentification Orchestrator validé. |
| **Sprint 6** | 27 Avr – 10 Mai | Déclenchement et suivi des robots RPA. | APIs de démarrage de Job (`/api/rpa/start`) et de suivi du statut des robots ; logs d'intégration. | Endpoints de déclenchement et de polling RPA opérationnels. |
| **Sprint 7** | 11 Mai – 24 Mai | Simulation métier et sécurisation. | Intégration de la simulation bancaire ; masquage des données sensibles ; journalisation de sécurité. | Pages de simulation fonctionnelles ; logs et masquage activés. |
| **Sprint 8** | 25 Mai – 07 Juin | Recette globale, tests et documentation. | Tests d'intégration end-to-end ; recette utilisateur ; rédaction de la documentation technique. | Prototype end-to-end validé ; manuel technique livré. |
| **Phase Finale** | 08 Juin – 14 Juil | Déploiement pilote et clôture du PFE. | Installation en environnement d'essai ; tests avec les équipes hotline ; rédaction du rapport final de PFE. | Rapport de PFE finalisé ; livrable prêt pour le pilote. |
