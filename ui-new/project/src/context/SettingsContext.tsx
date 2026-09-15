import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'auto';
export type Language = 'fr' | 'en';

interface SettingsContextType {
  theme: Theme;
  language: Language;
  setTheme: (theme: Theme) => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  fr: {
    // Sidebar
    "Navigation": "Navigation",
    "Session en cours": "Session en cours",
    "Historique": "Historique",
    "Dashboard Admin": "Dashboard Admin",
    "Outils": "Outils",
    "Portail Bancaire": "Portail Bancaire",
    "Précision": "Précision",
    "Jobs RPA": "Jobs RPA",
    "Déconnexion": "Déconnexion",
    "Paramètres": "Paramètres",
    
    // Chat
    "ASSISTANCE IA": "ASSISTANCE IA",
    "En ligne · Modèle NLP + RPA actif": "En ligne · Modèle NLP + RPA actif",
    "réponses": "réponses",
    "Nouvelle Session": "Nouvelle Session",
    "Bonjour, comment puis-je vous aider ?": "Bonjour, comment puis-je vous aider ?",
    "Votre assistant bancaire intelligent, disponible 24h/24. Posez votre question ou choisissez une action ci-dessous.": "Votre assistant bancaire intelligent, disponible 24h/24. Posez votre question ou choisissez une action ci-dessous.",
    "Consulter mon solde": "Consulter mon solde",
    "Débloquer ma carte": "Débloquer ma carte",
    "Faire un virement": "Faire un virement",
    "Activer dotation e-commerce": "Activer dotation e-commerce",
    "Chiffré SSL": "Chiffré SSL",
    "RPA Temps réel": "RPA Temps réel",
    "NLP Intelligent": "NLP Intelligent",
    "Posez votre question bancaire…": "Posez votre question bancaire…",
    "BOA IA · Sécurisé · Données chiffrées BOA": "BOA IA · Sécurisé · Données chiffrées BOA",
    "Traitement en cours par le robot...": "Traitement en cours par le robot...",
    "Message du robot RPA :": "Message du robot RPA :",
    "Opération effectuée avec succès !": "Opération effectuée avec succès !",
    "Le robot RPA a terminé le traitement bancaire.": "Le robot RPA a terminé le traitement bancaire.",
    "Échec technique de l'automate (RPA)": "Échec technique de l'automate (RPA)",
    "Statut : ": "Statut : ",
    "Une erreur réseau s'est produite. Vérifiez que votre serveur Java est lancé sur le port 8081.": "Une erreur réseau s'est produite. Vérifiez que votre serveur Java est lancé sur le port 8081.",
    
    // History
    "Retour au chat": "Retour au chat",
    "Historique des requêtes": "Historique des requêtes",
    "Supervision globale": "Supervision globale",
    "Mon compte": "Mon compte",
    "sessions": "sessions",
    "session": "session",
    "Actualiser": "Actualiser",
    "Vider l'historique": "Vider l'historique",
    "Total Échanges": "Total Échanges",
    "Confiance Moyenne": "Confiance Moyenne",
    "Confiance Élevée": "Confiance Élevée",
    "Requêtes à Réviser": "Requêtes à Réviser",
    "Rechercher dans les questions ou réponses...": "Rechercher dans les questions ou réponses...",
    "Filtrer :": "Filtrer :",
    "Tous": "Tous",
    "Moyenne": "Moyenne",
    "À réviser": "À réviser",
    "Chargement de l'historique…": "Chargement de l'historique…",
    "Aucune conversation correspondante": "Aucune conversation correspondante",
    "Modifiez vos critères de recherche ou de filtre.": "Modifiez vos critères de recherche ou de filtre.",
    "Précision Élevée": "Précision Élevée",
    "Précision Moyenne": "Précision Moyenne",
    "À Réviser": "À Réviser",
    "Assistant BOA": "Assistant BOA",
    "Êtes-vous sûr de vouloir vider tout votre historique d'échanges ?": "Êtes-vous sûr de vouloir vider tout votre historique d'échanges ?",
    
    // Settings
    "Langue de l'application": "Langue de l'application",
    "Thème d'affichage": "Thème d'affichage",
    "Clair": "Clair",
    "Sombre": "Sombre",
    "Automatique (Système)": "Automatique (Système)",
    "Sauvegarder les paramètres": "Sauvegarder les paramètres",
    "Paramètres sauvegardés avec succès !": "Paramètres sauvegardés avec succès !",
  },
  en: {
    // Sidebar
    "Navigation": "Navigation",
    "Session en cours": "Active Session",
    "Historique": "History",
    "Dashboard Admin": "Admin Dashboard",
    "Outils": "Tools",
    "Portail Bancaire": "Banking Portal",
    "Précision": "Accuracy",
    "Jobs RPA": "RPA Jobs",
    "Déconnexion": "Logout",
    "Paramètres": "Settings",
    
    // Chat
    "ASSISTANCE IA": "AI ASSISTANCE",
    "En ligne · Modèle NLP + RPA actif": "Online · NLP Model + RPA Active",
    "réponses": "responses",
    "Nouvelle Session": "New Session",
    "Bonjour, comment puis-je vous aider ?": "Hello, how can I help you?",
    "Votre assistant bancaire intelligent, disponible 24h/24. Posez votre question ou choisissez une action ci-dessous.": "Your intelligent banking assistant, available 24/7. Ask a question or select an action below.",
    "Consulter mon solde": "Check my balance",
    "Débloquer ma carte": "Unblock my card",
    "Faire un virement": "Make a transfer",
    "Activer dotation e-commerce": "Activate e-commerce limit",
    "Chiffré SSL": "SSL Encrypted",
    "RPA Temps réel": "Real-time RPA",
    "NLP Intelligent": "Intelligent NLP",
    "Posez votre question bancaire…": "Ask your banking question...",
    "BOA IA · Sécurisé · Données chiffrées BOA": "BOA AI · Secured · BOA Encrypted Data",
    "Traitement en cours par le robot...": "Processing by the robot...",
    "Message du robot RPA :": "RPA Robot Message:",
    "Opération effectuée avec succès !": "Operation completed successfully!",
    "Le robot RPA a terminé le traitement bancaire.": "The RPA robot completed the banking process.",
    "Échec technique de l'automate (RPA)": "Technical failure of the automation (RPA)",
    "Statut : ": "Status: ",
    "Une erreur réseau s'est produite. Vérifiez que votre serveur Java est lancé sur le port 8081.": "A network error occurred. Check that your Java server is running on port 8081.",
    
    // History
    "Retour au chat": "Back to Chat",
    "Historique des requêtes": "Queries History",
    "Supervision globale": "Global Supervision",
    "Mon compte": "My Account",
    "sessions": "sessions",
    "session": "session",
    "Actualiser": "Refresh",
    "Vider l'historique": "Clear History",
    "Total Échanges": "Total Exchanges",
    "Confiance Moyenne": "Average Confidence",
    "Confiance Élevée": "High Confidence",
    "Requêtes à Réviser": "Requests to Review",
    "Rechercher dans les questions ou réponses...": "Search in questions or answers...",
    "Filtrer :": "Filter:",
    "Tous": "All",
    "Moyenne": "Medium",
    "À réviser": "To Review",
    "Chargement de l'historique…": "Loading history...",
    "Aucune conversation correspondante": "No matching conversation",
    "Modifiez vos critères de recherche ou de filtre.": "Change your search or filter criteria.",
    "Précision Élevée": "High Accuracy",
    "Précision Moyenne": "Medium Accuracy",
    "À Réviser": "To Review",
    "Assistant BOA": "BOA Assistant",
    "Êtes-vous sûr de vouloir vider tout votre historique d'échanges ?": "Are you sure you want to clear your entire chat history?",
    
    // Settings
    "Langue de l'application": "Application Language",
    "Thème d'affichage": "Display Theme",
    "Clair": "Light",
    "Sombre": "Dark",
    "Automatique (Système)": "Automatic (System)",
    "Sauvegarder les paramètres": "Save Settings",
    "Paramètres sauvegardés avec succès !": "Settings saved successfully!",
  }
};

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem('boa_theme') as Theme) || 'auto';
  });

  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('boa_language') as Language) || 'fr';
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('boa_theme', newTheme);
  };

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    localStorage.setItem('boa_language', newLang);
  };

  // Apply Theme effect
  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      if (theme === 'dark') {
        root.classList.add('theme-dark');
        root.classList.remove('theme-light');
      } else if (theme === 'light') {
        root.classList.add('theme-light');
        root.classList.remove('theme-dark');
      } else {
        // Auto
        if (mediaQuery.matches) {
          root.classList.add('theme-dark');
          root.classList.remove('theme-light');
        } else {
          root.classList.add('theme-light');
          root.classList.remove('theme-dark');
        }
      }
    };

    applyTheme();

    // Listen to system theme changes if set to auto
    const listener = () => {
      if (theme === 'auto') {
        applyTheme();
      }
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [theme]);

  // Translation helper
  const t = (key: string): string => {
    const langDict = translations[language];
    return langDict && langDict[key] ? langDict[key] : key;
  };

  return (
    <SettingsContext.Provider value={{ theme, language, setTheme, setLanguage, t }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
