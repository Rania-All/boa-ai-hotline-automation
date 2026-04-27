export type TicketType = 'N1' | 'N1-IN' | 'N1-HR' | 'N1-RR' | 'N2' | 'N2-HR' | 'GREETING';
export type IntentCode =
  | 'INFO_BMCE_DIRECT'
  | 'CARD_UNBLOCK'
  | 'GET_BALANCE'
  | 'DOTATION_ACTIVATE'
  | 'EXTERNAL_TRANSFER'
  | 'GREETING'
  | 'UNKNOWN';

export type RouteResult = {
  type: TicketType;
  intent: IntentCode;
  answer: string;
  confidence: number;
  handledLocally: boolean;
};

type Rule = {
  intent: IntentCode;
  type: TicketType;
  patterns: (string | RegExp)[];
  answer: string;
  confidence: number;
};

const RULES: Rule[] = [
  {
    intent: 'GREETING',
    type: 'N1',
    patterns: [/^salut/, /^bonjour/, /^coucou/, /^hello/, /^hey/, /^bonsoir/, /^salam/],
    answer: "Bonjour ! Je suis l'assistant intelligent de BANK OF AFRICA. Que puis-je faire pour vous aujourd'hui ?",
    confidence: 1.0,
  },
  {
    intent: 'INFO_BMCE_DIRECT',
    type: 'N1-IN',
    patterns: [
      'bmce direct',
      'c est quoi bmce direct',
      'que est ce bmce direct',
      /bmce[\s-]?direct/i,
      /banque[\s-]?a[\s-]?distance/i,
      /banque[\s-]?en[\s-]?ligne/i
    ],
    answer: "BMCE Direct est le service de banque à distance de BANK OF AFRICA. Il vous permet de consulter vos comptes, voir l'historique et effectuer vos opérations bancaires en ligne en toute sécurité.",
    confidence: 0.95,
  },
  {
    intent: 'CARD_UNBLOCK',
    type: 'N1-RR',
    patterns: [
      'carte bloquee',
      'debloquer ma carte',
      'deblocage carte',
      /debloqu\w*\s+.*carte/i,
      /carte.*bloqu\w*/i,
      /d[eé]bloqu[eé]r.*carte/i
    ],
    answer: "J'ai bien compris que vous souhaitez débloquer votre carte bancaire. Je lance immédiatement le robot pour traiter votre demande...",
    confidence: 0.95,
  },
  {
    intent: 'GET_BALANCE',
    type: 'N1-RR',
    patterns: [
      'quel est mon solde',
      'verifier mon solde',
      'consulter mon solde',
      'solde compte',
      /mon\s+solde/i,
      /combien\s+(j ai|j'ai|me\s+reste)/i,
      /consulter.*compte/i,
      /avoir.*compte/i,
      /^solde$/i
    ],
    answer: "Très bien, je vais consulter le solde de votre compte en temps réel via notre système autonome. Un instant...",
    confidence: 0.95,
  },
  {
    intent: 'DOTATION_ACTIVATE',
    type: 'N1-RR',
    patterns: [
      'activer ma dotation',
      'dotation e commerce',
      'dotation ecommerce',
      /activ\w*\s+.*dotation/i,
      /dotation.*ecommerce/i,
      /dotation.*internet/i,
      /dotation.*voyage/i
    ],
    answer: "D'accord, je demande au robot RPA d'activer votre dotation e-commerce tout de suite.",
    confidence: 0.95,
  },
  {
    intent: 'EXTERNAL_TRANSFER',
    type: 'N1-RR',
    patterns: [
      'virement externe',
      'mise a disposition',
      'faire un virement',
      /envoyer\s+(de\s+l\s*)?argent/i,
      /faire.*virement/i,
      /transferer.*argent/i,
      /transfert.*externe/i,
      /^virement$/i
    ],
    answer: "C'est noté. Je prépare l'opération de virement / mise à disposition grâce à notre traitement automatique RPA.",
    confidence: 0.95,
  },
];

function normalize(input: string): string {
  // Une normalisation extrême pour tolérer la casse, les accents, la ponctuation
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // supprime les accents
    .replace(/[?!.,;:'"()_-]/g, ' ') // remplace la ponctuation par des espaces
    .replace(/\s+/g, ' ') // vire les espaces multiples
    .trim();
}

const STOP_WORDS = new Set(['est', 'quoi', 'que', 'qui', 'comment', 'pourquoi', 'avec', 'pour', 'dans', 'sur', 'des', 'les']);

function overlapScore(a: string, b: string): number {
  const at = new Set(normalize(a).split(' ').filter((x) => x.length > 2 && !STOP_WORDS.has(x)));
  const bt = new Set(normalize(b).split(' ').filter((x) => x.length > 2 && !STOP_WORDS.has(x)));
  if (at.size === 0 || bt.size === 0) return 0;
  let common = 0;
  for (const token of at) {
    for (const bToken of bt) {
      if (bToken === token || bToken.includes(token) || token.includes(bToken)) {
        common++;
        break;
      }
    }
  }
  return common / Math.max(at.size, bt.size);
}


export function routeQuestion(question: string): RouteResult {
  const qn = normalize(question);
  const qraw = question.toLowerCase().trim();

  let best: { rule: Rule; score: number } | null = null;

  for (const rule of RULES) {
    for (const p of rule.patterns) {
      if (p instanceof RegExp) {
        // Test sur la raw string (les regex peuvent capturer des trucs intéressants avant/après)
        if (p.test(qn) || p.test(qraw)) {
          return {
            type: rule.type,
            intent: rule.intent,
            answer: rule.answer,
            confidence: rule.confidence,
            handledLocally: true,
          };
        }
      } else {
        const pn = normalize(p as string);
        // Correspondance exacte ou inclusion très robuste
        if (qn === pn) {
          return { type: rule.type, intent: rule.intent, answer: rule.answer, confidence: 1.0, handledLocally: true };
        }

        const score = qn.includes(pn) ? 0.9 : overlapScore(qn, pn);
        if (!best || score > best.score) best = { rule, score };
      }
    }
  }

  // Si on trouve une similarité par chevauchement
  if (best && best.score >= 0.70) { // Seuil exigeant pour laisser le backend gérer l'informationnel
    return {
      type: best.rule.type,
      intent: best.rule.intent,
      answer: best.rule.answer,
      confidence: best.score,
      handledLocally: true,
    };
  }

  // Answer for unknown, handled locally to act intelligently instead of falling back to raw backend
  return {
    type: 'N1-HR',
    intent: 'UNKNOWN',
    answer: "Votre demande est bien prise en compte, cependant je ne suis pas certain de la nature de l'action. Souhaitez-vous gérer une carte, vérifier un solde, faire un virement, ou en savoir plus sur BMCE Direct ?",
    confidence: 0.4,
    handledLocally: false, // fallback to backend if backend can do better
  };
}
