# RPA – Architecture et étapes (projet Automatisation Hotline)

Document détaillé pour présenter la partie RPA du projet à l’encadrant pédagogique : architecture, flux, étapes techniques, sécurité et planning.

---

## 1. Vue d’ensemble

Le projet **Automatisation Hotline (version Python)** comporte deux parties principales :

- **Partie 1 – Chatbot (FAQ)** : Un **chatbot** s’appuie sur un **fichier Excel** contenant des paires **question / réponse** (base FAQ). À partir de la question de l’utilisateur, une **classification** est effectuée (par exemple via RAG ou moteur de similarité) pour retrouver la réponse adaptée ou pour décider si la demande relève du périmètre **N1-RR** (éligible à l’automatisation RPA).

- **Partie 2 – RPA** : Lorsque la classification indique un cas N1-RR, l’application **Python** (backend avec **RAG** pour la classification et l’IA) déclenche et suit l’exécution des processus **UiPath** via l’**Orchestrator**.

Ce document décrit l’**architecture et les étapes de la partie RPA**. Le détail complet est également fourni en **Word** (**`docs/RPA-Detail-Robot-Architecture-Etapes.docx`**) et en **Excel** (**`docs/RPA-Detail-Robot-Architecture-Etapes.xlsx`**).

---

## 2. Architecture RPA

### 2.1 Composants principaux

| Composant | Rôle |
|-----------|------|
| **Application Python (RAG)** | Backend métier : classification N1-RR via RAG/IA, vérification des données, appel des APIs UiPath (client HTTP), suivi des jobs, retour au client. |
| **UiPath Orchestrator** | Plateforme centrale : authentification (OAuth2), envoi des jobs aux robots, suivi du statut. |
| **UiPath Robots** | Exécution des processus RPA (traitement N1-RR, automatisation des tâches hotline). |

### 2.2 Schéma de flux (haut niveau)

```
┌─────────────────┐     ┌──────────────────────────┐     ┌─────────────────────┐
│  Client /       │     │  Backend Python           │     │  UiPath             │
│  Interface      │────▶│  (RAG + API)              │────▶│  Orchestrator       │
│  (Hotline)      │     │  - RAG / IA (N1-RR)       │     │  (OAuth2 + APIs)    │
└─────────────────┘     │  - Vérification données   │     └──────────┬──────────┘
                        │  - Client HTTP → APIs     │                │
                        └──────────────────────────┘                │
                                                                    ▼
                        ┌──────────────────────────┐     ┌─────────────────────┐
                        │  Retour automatique      │◀────│  Robots UiPath       │
                        │  au client               │     │  (processus RPA)     │
                        └──────────────────────────┘     └─────────────────────┘
```

### 2.3 Implémentation technique (backend Python)

- **Configuration** : variables d’environnement ou fichier `.env` (ex. `UIPATH_BASE_URL`, `UIPATH_CLIENT_ID`, `UIPATH_CLIENT_SECRET`, `UIPATH_FOLDER_ID`, `UIPATH_RELEASE_KEY`).
- **Client Orchestrator** : module Python (ex. `requests` ou `httpx`) pour l’authentification OAuth2, le démarrage de job (POST Start Jobs) et la récupération du statut (GET Jobs).
- **RAG** : chaîne RAG (LLM + base documentaire) pour la classification N1-RR et la génération de réponses ; le résultat de classification déclenche ou non l’appel RPA.
- **API REST exposée** : endpoints (ex. FastAPI/Flask) `/api/rpa/start` et `/api/rpa/status/{job_key}` pour déclencher un job et consulter son statut.

---

## 3. Étapes détaillées du déclenchement UiPath depuis Python

Les étapes ci-dessous correspondent au flux réel : de la classification jusqu’au retour au client.

### Étape 1 : Classification N1-RR par le module IA

- **Objectif** : Déterminer si la demande relève du périmètre N1-RR (éligible à l’automatisation).
- **Contexte** : En **partie 1**, le **chatbot** utilise un **fichier Excel** (questions / réponses FAQ) pour répondre aux demandes courantes. À partir de cette base et du texte saisi, une **classification** est réalisée : soit une réponse est trouvée dans la FAQ, soit la demande est identifiée comme N1-RR et oriente vers le robot RPA.
- **Rôle** : Le module **RAG** (retrieval + LLM) du backend Python classe la requête ; seules les demandes N1-RR déclenchent un job RPA.
- **Lien projet** : Chaîne RAG (embedding, base vectorielle, prompt de classification) et exploitation du fichier Excel FAQ dans le backend Python (mois 2 du plan).

### Étape 2 : Vérification des données requises

- **Objectif** : S’assurer que toutes les données nécessaires au robot sont présentes et valides (ex. identifiants, paramètres métier).
- **Rôle** : Éviter de lancer un job avec des entrées incomplètes ou incorrectes.
- **Implémentation** : Contrôles côté backend avant l’appel à l’API « Start Job ».

### Étape 3 : Authentification auprès d’UiPath Orchestrator (OAuth2)

- **Objectif** : Obtenir un token d’accès pour appeler les APIs Orchestrator de manière sécurisée.
- **Méthode** : **OAuth2** (grant type `client_credentials`).
- **Détails techniques** :
  - URL token (cloud) : `https://cloud.uipath.com/identity_/connect/token`
  - Paramètres : `client_id`, `client_secret`, `scope` (ex. `OR.Folders OR.Jobs`)
  - Le backend Python utilise ce token dans l’en-tête `Authorization: Bearer <token>` pour toutes les requêtes vers l’Orchestrator.
- **Implémentation** : requête POST (ex. `requests.post()` ou `httpx.post()`) en `application/x-www-form-urlencoded` vers l’endpoint Identity ; récupération de `access_token` dans la réponse JSON.

### Étape 4 : Appel API « Start Job » via client HTTP (Python)

- **Objectif** : Demander à l’Orchestrator de lancer un job pour un processus (release) donné.
- **Méthode** : POST vers l’endpoint OData des jobs (ex. `/odata/Jobs/UiPath.Server.Configuration.OData.StartJobs`).
- **En-têtes** : `Authorization: Bearer <token>`, `X-UIPATH-OrganizationUnitId` (folder), `Content-Type: application/json`.
- **Corps** : Objet « startInfo » avec notamment :
  - `ReleaseKey` : identifiant du processus à exécuter,
  - `Strategy` : ex. `Specific`,
  - `InputArguments` : arguments en JSON (voir étape 5),
  - `JobsCount`, etc.
- **Implémentation** : `requests.post()` ou `httpx.post()` avec le body en `json.dumps(...)` ; parsing de la réponse pour extraire la clé du job (`job_key`).

### Étape 5 : Transmission des InputArguments en JSON

- **Objectif** : Passer au robot les données métier (action, payload, etc.) nécessaires pour exécuter le processus.
- **Format** : Chaîne JSON (UiPath attend une sérialisation JSON des arguments).
- **Exemple côté API exposée** : `action` + `payload` sont regroupés dans un dictionnaire Python puis sérialisés avec `json.dumps(...)` pour le champ `InputArguments`.
- **Implémentation** : `json.dumps({"action": ..., "payload": ...})` (ou structure équivalente) inséré dans le corps de la requête Start Job.

### Étape 6 : Suivi du job via API « Get Job Status »

- **Objectif** : Savoir si le job est en cours, terminé, en erreur, etc.
- **Méthode** : GET sur l’API OData des Jobs avec filtre sur la clé du job (ex. `$filter=Key eq '<job_key>'`).
- **Usage** : Le client (ou un processus asynchrone) peut appeler périodiquement cette API jusqu’à terminaison ou timeout.
- **Implémentation** : `requests.get()` ou `httpx.get()` vers l’URL OData avec le filtre ; exposé côté API Python via `GET /api/rpa/status/{job_key}`.

### Étape 7 : Retour automatique au client

- **Objectif** : Remonter le résultat ou le statut du job au client (interface hotline ou autre consommateur de l’API).
- **Comportement** : Après démarrage du job, le backend Python renvoie immédiatement la clé du job et l’état initial ; le client peut ensuite interroger `/api/rpa/status/{job_key}` pour le suivi. Une évolution possible est un retour asynchrone (webhook ou polling) une fois le job terminé.

---

## 4. Sécurité et conformité

| Mesure | Description |
|--------|-------------|
| **Masquage des données sensibles** | Les données sensibles (ex. numéro de carte) sont masquées avant envoi ou affichage (côté métier / logs). |
| **Journalisation des actions** | Les appels RPA (démarrage, statut) et les erreurs sont loggés pour traçabilité et audit. |
| **Gestion des erreurs et escalade** | En cas d’échec (token, API, timeout), le backend gère l’erreur et peut prévoir une escalade automatique (notification, repli manuel). |

Les secrets (`client_id`, `client_secret`) sont configurés via des variables d’environnement ou un fichier `.env` (non versionné) et ne sont pas exposés dans le code.

---

## 5. KPIs attendus

- **Taux de précision de classification** : > 85 % (module RAG/IA pour N1-RR).
- **Taux d’automatisation N1-RR** : > 60 % des cas N1-RR traités par RPA.
- **Réduction du temps moyen de traitement** : objectif global du projet.

---

## 6. Planning (extrait – partie RPA)

- **Mois 1** : Formation UiPath Academy, conception architecture Python (RAG + API), spécifications fonctionnelles et techniques (dont RPA).
- **Mois 2** : Développement chaîne RAG, API REST (FastAPI/Flask) et moteur de décision (préparation des données et de la classification pour RPA).
- **Mois 3 (S9–S12) – Intégration UiPath** :
  - Implémentation du service d’authentification Orchestrator (OAuth2).
  - Développement du déclenchement de job via API (Start Job + InputArguments).
  - Tests avec les robots existants.
  - Gestion des logs et des erreurs.
  - **Livrable** : Prototype end-to-end fonctionnel.
- **Mois 4** : Tests utilisateurs (hotline), optimisation des performances, documentation technique complète. **Livrable** : Solution prête pour pilote.

---

## 7. Résumé pour l’encadrant

- **Architecture** : Backend Python (RAG + API) ↔ UiPath Orchestrator (OAuth2) ↔ Robots UiPath ; le backend déclenche et suit les jobs via des appels HTTP (requests/httpx) aux APIs Orchestrator.
- **Étapes clés** : Classification N1-RR (IA) → Vérification des données → Authentification OAuth2 → Start Job (InputArguments en JSON) → Suivi par Get Job Status → Retour au client.
- **Sécurité** : Masquage des données sensibles, journalisation, gestion des erreurs et escalade ; secrets en configuration.
- **Planning RPA** : Intégration UiPath concentrée au mois 3 (semaines 9–12), avec prototype end-to-end puis industrialisation en mois 4.

Ce document peut être utilisé tel quel pour une présentation orale ou une annexe du rapport de stage.

**Fichiers annexes** : Le détail complet (vue d’ensemble avec chatbot/FAQ Excel, architecture, étapes RPA, sécurité, KPIs, planning) est disponible dans :
- **`docs/RPA-Detail-Robot-Architecture-Etapes.docx`** (Word) pour édition et présentation ;
- **`docs/RPA-Detail-Robot-Architecture-Etapes.xlsx`** (Excel) pour consultation en tableau.
