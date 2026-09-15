# Guide pas à pas : Configurer son premier projet Jira (Projet PFE Rania)

Ce guide est destiné à vous accompagner pas à pas dans la configuration de votre projet Jira pour le projet **Automatisation Hotline - Version Java**, en suivant fidèlement votre plan de réalisation de 4 mois (16 semaines).

---

## Étape 1 : Créer votre projet Scrum sur Jira
1. Connectez-vous sur [Jira Cloud](https://www.atlassian.com/fr/software/jira) (créez un compte gratuit si ce n'est pas déjà fait).
2. Une fois connecté, cliquez sur le bouton **Créer un projet** (ou *Create Project*).
3. Jira va vous proposer plusieurs modèles. Sélectionnez le modèle **Scrum**. (C'est indispensable pour gérer des Sprints et un Backlog).
4. Choisissez le type de projet : cliquez sur **Sélectionner un projet géré par l'équipe** (*Team-managed project*). C'est l'option la plus simple, idéale pour débuter.
5. Nommez votre projet : `Automatisation Hotline BOA` (la clé de projet se génère automatiquement, par exemple `AHB`).
6. Cliquez sur **Créer**.

---

## Étape 2 : Créer vos 4 Epics (Vos 4 mois de projet)
Dans Jira, un **Epic** représente une grande phase du projet qui englobe plusieurs sous-tâches. Nous allons créer un Epic pour chaque mois de votre plan.

1. Dans le menu latéral gauche de Jira, cliquez sur **Backlog**.
2. Si le volet des Epics n'est pas visible, cliquez sur le petit bouton **Epics** en haut à gauche du backlog pour l'ouvrir.
3. Cliquez sur **Créer un ticket** (le gros bouton bleu **Create** tout en haut de l'écran).
4. Dans le formulaire qui s'ouvre :
   - Vérifiez que *Type de ticket* (*Issue Type*) est bien réglé sur **Epic**.
   - Saisissez le titre de l'Epic :
     * **Epic 1** : `Mois 1 : Analyse & Conception & Formation UiPath` (S1-S4)
     * **Epic 2** : `Mois 2 : Développement IA & Backend` (S5-S8)
     * **Epic 3** : `Mois 3 : Intégration UiPath` (S9-S12)
     * **Epic 4** : `Mois 4 : Tests & Industrialisation` (S13-S16)
   - Cliquez sur **Créer** pour chaque Epic.

---

## Étape 3 : Créer et configurer vos 8 Sprints
Votre projet dure 16 semaines. Puisqu'un Sprint dure généralement **2 semaines**, nous allons créer **8 Sprints**.

1. Toujours dans l'onglet **Backlog**, vous verrez par défaut une zone appelée `Sprint 1`.
2. Cliquez sur le bouton **Créer un sprint** (*Create Sprint*) situé en haut à droite pour ajouter d'autres sprints. Cliquez 7 fois pour obtenir les sprints de `Sprint 1` à `Sprint 8`.
3. Pour définir les dates de vos sprints, cliquez sur les **trois petits points (...)** à côté du nom de chaque sprint, puis sur **Modifier le sprint** (*Edit Sprint*) :
   - **Sprint 1** (S1-S2) : 16 février au 1er mars
   - **Sprint 2** (S3-S4) : 2 mars au 15 mars
   - **Sprint 3** (S5-S6) : 16 mars au 29 mars
   - **Sprint 4** (S7-S8) : 30 mars au 12 avril
   - **Sprint 5** (S9-S10) : 13 avril au 26 avril
   - **Sprint 6** (S11-S12) : 27 avril au 10 mai
   - **Sprint 7** (S13-S14) : 11 mai au 24 mai
   - **Sprint 8** (S15-S16) : 25 mai au 7 juin
   *(Note : la période de juin à mi-juillet sert de phase finale de stabilisation avant la soutenance).*

---

## Étape 4 : Créer les tickets (User Stories / Backlog) et les associer
Maintenant, nous allons saisir les tâches de votre photo et les classer dans les bons Sprints et Epics.

1. Allez dans le **Backlog**.
2. Sous le nom de chaque Sprint, il y a un champ `+ Créer un ticket` (*+ Create issue*).
3. Saisissez le titre de la tâche (par exemple: `Analyse des cas d'usage fournis`) et appuyez sur **Entrée**. Le ticket est créé.
4. Cliquez sur la tâche que vous venez de créer pour ouvrir son volet de détails à droite de l'écran.
5. Dans ce volet de détails :
   - Associez-le à son Epic en cliquant sur le champ **Epic** et en choisissant l'Epic correspondant.
   - Réglez la **Priorité** (High/Medium/Low ou Must/Should).
   - Rédigez le **Critère d'acceptation** dans la description.

Voici la liste exacte des tâches à saisir pour chaque sprint en suivant votre plan :

### Mois 1 (Epic 1 : Analyse & Conception & Formation)
* **Sprint 1 (S1-S2)** :
  1. `Analyse des cas d'usage fournis` (Priorité : Must)
  2. `Formation UiPath Academy` (Priorité : Must)
  3. `Nettoyage et structuration des données` (Priorité : Should)
* **Sprint 2 (S3-S4)** :
  1. `Conception de l'architecture Spring Boot` (Priorité : Must)
  2. `Définition des flux N1-RR` (Priorité : Must)

### Mois 2 (Epic 2 : Développement IA & Backend)
* **Sprint 3 (S5-S6)** :
  1. `Implémentation du module de classification` (Priorité : Must)
  2. `Développement des premières APIs REST Spring Boot` (Priorité : Must)
* **Sprint 4 (S7-S8)** :
  1. `Implémentation du moteur de décision` (Priorité : Must)
  2. `Écriture et exécution des tests unitaires` (Priorité : Should)

### Mois 3 (Epic 3 : Intégration UiPath)
* **Sprint 5 (S9-S10)** :
  1. `Implémentation du service d'authentification Orchestrator` (Priorité : Must)
  2. `Développement du déclenchement de Job via l'API Rest` (Priorité : Must)
* **Sprint 6 (S11-S12)** :
  1. `Tests d'intégration avec les robots UiPath existants` (Priorité : Must)
  2. `Mise en place de la gestion des logs et des erreurs d'intégration` (Priorité : Should)

### Mois 4 (Epic 4 : Tests & Industrialisation)
* **Sprint 7 (S13-S14)** :
  1. `Tests utilisateurs avec l'équipe Hotline` (Priorité : Must)
  2. `Optimisation des performances de l'application` (Priorité : Should)
* **Sprint 8 (S15-S16)** :
  1. `Rédaction de la documentation technique complète` (Priorité : Must)
  2. `Préparation des supports de soutenance et clôture` (Priorité : Must)

---

## Étape 5 : Lancer et faire vivre vos Sprints
1. Une fois que tous vos tickets sont affectés au **Sprint 1**, cliquez sur le bouton bleu **Lancer le sprint** (*Start Sprint*) à côté du nom de Sprint 1.
2. Choisissez la date de début et de fin, puis validez.
3. Jira vous redirige vers le **Tableau** (*Board*).
4. Pendant vos réunions quotidiennes (**Daily Scrum**), faites simplement glisser vos tickets d'une colonne à l'autre :
   * **À faire** (To Do) ➔ **En cours** (In Progress) ➔ **Terminé** (Done).
5. À la fin des 2 semaines, cliquez sur **Terminer le sprint** (*Complete Sprint*) pour basculer automatiquement les tâches restantes sur le Sprint 2 et démarrer le suivant.
