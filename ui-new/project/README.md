# Bank of Africa - Assistant Intelligent

Interface web moderne pour le chatbot intelligent de la Bank of Africa. Cette application permet aux clients d'interagir avec un assistant virtuel pour obtenir des réponses automatiques à leurs questions bancaires.

## Fonctionnalités

### Page Chat Principale
- Interface de discussion en temps réel avec le chatbot
- Messages en bulles avec distinction visuelle utilisateur/bot
- Horodatage sur chaque message
- Animation de saisie lors du traitement des questions
- Message de bienvenue avec boutons d'action rapide
- Score de confiance affiché pour chaque réponse
- Session persistante avec historique local

### Page Historique
- Tableau complet des conversations
- Affichage des questions, réponses et scores de confiance
- Filtrage et tri des échanges
- Interface responsive et scrollable

### Composants
- Sidebar avec navigation
- Bulles de messages personnalisées
- Indicateur de saisie animé
- Actions rapides (chips)
- Design responsive (mobile & desktop)
- Scrollbars personnalisées

## Technologies Utilisées

- **React 18** avec TypeScript
- **Vite** pour le build
- **Tailwind CSS** pour le styling
- **Supabase** pour la base de données
- **Lucide React** pour les icônes

## Installation

1. Clonez le repository
2. Installez les dépendances :
```bash
npm install
```

3. Créez un fichier `.env` basé sur `.env.example` :
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_BACKEND_URL=http://localhost:8080
```

4. Lancez l'application en mode développement :
```bash
npm run dev
```

5. Pour build en production :
```bash
npm run build
```

## Architecture

```
src/
├── components/          # Composants réutilisables
│   ├── Sidebar.tsx     # Navigation latérale
│   ├── MessageBubble.tsx
│   ├── TypingIndicator.tsx
│   └── QuickActions.tsx
├── pages/              # Pages principales
│   ├── Chat.tsx        # Interface de chat
│   └── History.tsx     # Historique des conversations
├── services/           # Services API
│   └── api.ts
├── lib/                # Configuration
│   └── supabase.ts
├── types/              # Types TypeScript
│   └── index.ts
├── utils/              # Utilitaires
│   └── session.ts
├── App.tsx             # Composant principal avec routing
└── main.tsx            # Point d'entrée

```

## API Backend

L'application communique avec un backend via deux endpoints :

### POST /api/ask
Envoie une question au chatbot
```json
{
  "question": "Comment ouvrir un compte ?"
}
```

Réponse :
```json
{
  "answer": "Pour ouvrir un compte...",
  "confidence": 0.95
}
```

### GET /api/history
Récupère l'historique complet des conversations depuis Supabase

## Base de Données

Structure de la table `conversations` :
- `id` : UUID unique
- `question` : Question de l'utilisateur
- `answer` : Réponse du bot
- `confidence` : Score de confiance (0-1)
- `session_id` : Identifiant de session
- `created_at` : Date et heure

## Personnalisation

### Couleurs
Les couleurs principales de Bank of Africa (rouge #DC2626) sont définies dans Tailwind. Vous pouvez les modifier dans `tailwind.config.js`.

### Questions Rapides
Les questions pré-définies se trouvent dans `src/components/QuickActions.tsx`.

## Développement

- `npm run dev` : Serveur de développement
- `npm run build` : Build de production
- `npm run preview` : Prévisualisation du build
- `npm run lint` : Vérification du code
- `npm run typecheck` : Vérification des types TypeScript

## Notes

- La session utilisateur est stockée dans localStorage
- L'historique est persisté dans Supabase
- Le design est responsive et adapté aux mobiles
- Les scrollbars sont personnalisées pour correspondre au thème BOA
