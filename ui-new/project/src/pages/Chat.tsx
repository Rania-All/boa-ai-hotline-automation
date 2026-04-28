import { useState, useEffect, useRef } from 'react';
import { Send, PlusCircle, Zap, Shield, Bot, ChevronRight, Sparkles, Activity } from 'lucide-react';
import MessageBubble from '../components/MessageBubble';
import TypingIndicator from '../components/TypingIndicator';
import { askQuestion, getSessionHistory, triggerRpaWorkflow, notifyUserByEmail } from '../services/api';
import { clearSession, getSessionId } from '../utils/session';
import type { Message } from '../types';
import { routeQuestion } from '../utils/chatRouter';

const QUICK_QUESTIONS = [
  { label: "Consulter mon solde", icon: "💳", intent: "solde" },
  { label: "Débloquer ma carte", icon: "🔓", intent: "carte" },
  { label: "Faire un virement", icon: "💸", intent: "virement" },
  { label: "Activer dotation e-commerce", icon: "🌐", intent: "dotation" },
];

const CLASSIFICATION_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  'N1-RR': { label: 'N1-RR · Traitement RPA', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  'N1-IN': { label: 'N1-IN · IA Automatique', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  'N1-HR': { label: 'N1-HR · Intervention', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  'N2':    { label: 'N2 · Monétique Expert', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(() => getSessionId());
  const [classificationTag, setClassificationTag] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { loadSessionHistory(); }, []);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isLoading]);

  const loadSessionHistory = async () => {
    try {
      const history = await getSessionHistory(sessionId);
      const loaded: Message[] = [];
      history.forEach((conv) => {
        loaded.push({ id: `${conv.id}-q`, question: conv.question, answer: '', confidence: 0, timestamp: new Date(conv.created_at), isUser: true });
        loaded.push({ id: `${conv.id}-a`, question: '', answer: conv.answer, confidence: conv.confidence, timestamp: new Date(conv.created_at), isUser: false });
      });
      setMessages(loaded);
    } catch (e) { /* silent */ }
  };

  const simulateGenerativeAI = async (prompt: string): Promise<string> => {
    await new Promise(r => setTimeout(r, 600 + Math.random() * 800));
    const p = prompt.toLowerCase();
    if (p.includes("merci") || p.includes("choukr")) return "Je vous en prie ! N'hésitez pas pour toute autre opération bancaire.";
    if (p.match(/ça va|ca va|comment vas/)) return "Je suis opérationnel à 100% et prêt à traiter vos requêtes bancaires. En quoi puis-je vous aider ?";
    if (p.includes("qui es tu") || p.includes("ton nom")) return "Je suis l'assistant IA de BANK OF AFRICA ";
    return `Votre question a bien été reçue. Pour les opérations sensibles, je vous recommande de contacter votre conseiller. Puis-je vous aider avec une carte, un virement ou votre solde ?`;
  };

  const handleSendMessage = async (override?: string) => {
    const text = (override ?? inputValue).trim();
    if (!text || isLoading) return;

    const userMsg: Message = { id: `u-${Date.now()}`, question: text, answer: '', confidence: 0, timestamp: new Date(), isUser: true };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);
    setClassificationTag(null);

    try {
      const route = routeQuestion(text);
      setClassificationTag(route.type);

      if (route.type === 'N1-RR') {
        const rpa = await triggerRpaWorkflow({ question: text, sessionId, intentCode: route.intent, accountRef: 'DEMO_ACC_001', userEmail: 'client@boa.local' });
        await notifyUserByEmail({ email: 'client@boa.local', subject: 'Confirmation RPA', message: rpa.resultText });
        setMessages(prev => [...prev, { id: `b-${Date.now()}`, question: '', answer: `${route.answer}\n\n✅ Robot RPA exécuté avec succès !\n📋 Résultat : ${rpa.resultText}\n📧 Confirmation envoyée par email.`, confidence: 0.95, timestamp: new Date(), isUser: false }]);
      } else if (route.handledLocally) {
        await new Promise(r => setTimeout(r, 700));
        setMessages(prev => [...prev, { id: `b-${Date.now()}`, question: '', answer: route.answer, confidence: route.confidence, timestamp: new Date(), isUser: false }]);
      } else {
        let finalAnswer = '';
        try {
          const resp = await askQuestion(text, sessionId);
          if (!resp.answer || resp.confidence < 0.35 || resp.answer.includes("Je n'ai pas compris")) throw new Error('fallback');
          finalAnswer = resp.answer;
        } catch {
          finalAnswer = await simulateGenerativeAI(text);
        }
        setMessages(prev => [...prev, { id: `b-${Date.now()}`, question: '', answer: finalAnswer, confidence: 0.92, timestamp: new Date(), isUser: false }]);
      }
    } catch {
      setMessages(prev => [...prev, { id: `e-${Date.now()}`, question: '', answer: "Une erreur réseau s'est produite. Veuillez réessayer.", confidence: 0, timestamp: new Date(), isUser: false }]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleNewChat = () => {
    clearSession();
    setSessionId(getSessionId());
    setMessages([]);
    setClassificationTag(null);
  };

  const botCount = messages.filter(m => !m.isUser).length;

  return (
    <div className="chat-container-root" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-deep)', fontFamily: 'var(--font-body)', overflow: 'hidden' }}>

      {/* ── HEADER ── */}
      <header className="chat-header">
        <div className="header-brand">
          <div className="brand-orb">
            <Bot size={20} color="#fff" />
          </div>
          <div>
            <div className="brand-name"> Bank Of Africa - Assistance </div>
            <div className="brand-status">
              <span className="status-dot" />
              En ligne · Modèle NLP + RPA actif
            </div>
          </div>
        </div>
        <div className="header-actions">
          {classificationTag && CLASSIFICATION_LABELS[classificationTag] && (
            <div className="classification-pill" style={{ color: CLASSIFICATION_LABELS[classificationTag].color, background: CLASSIFICATION_LABELS[classificationTag].bg }}>
              <Activity size={12} />
              {CLASSIFICATION_LABELS[classificationTag].label}
            </div>
          )}
          <div className="msg-counter">
            <Zap size={13} />
            {botCount} réponses
          </div>
          <button className="btn-new-chat-premium" onClick={handleNewChat}>
            <PlusCircle size={16} />
            Nouvelle Session
          </button>
        </div>
      </header>

      {/* ── MESSAGES ── */}
      <div className="messages-area">
        <div className="messages-inner">

          {/* Welcome state */}
          {messages.length === 0 && (
            <div className="welcome-block">
              <div className="welcome-glow" />
              <div className="welcome-icon">
                <Sparkles size={20} color="var(--accent)" />


              </div>
              <h2 className="welcome-title">Bonjour, comment puis-je vous aider ?</h2>


              <div className="quick-grid">
                {QUICK_QUESTIONS.map((q, i) => (
                  <button key={i} className="quick-card" onClick={() => handleSendMessage(q.label)}>
                    <span className="quick-icon">{q.icon}</span>
                    <span className="quick-label">{q.label}</span>
                    <ChevronRight size={14} className="quick-arrow" />
                  </button>
                ))}
              </div>

              <div className="trust-badges">
                <span className="badge"><Shield size={11} /> Chiffré SSL</span>
                <span className="badge"><Zap size={11} /> RPA Temps réel</span>
                <span className="badge"><Bot size={11} /> NLP Intelligent</span>
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <MessageBubble
              key={msg.id}
              message={msg.isUser ? msg.question : msg.answer}
              isUser={!!msg.isUser}
              timestamp={msg.timestamp}
              isNew={idx === messages.length - 1 && !msg.isUser}
            />
          ))}

          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ── INPUT ── */}
      <div className="input-dock">
        <div className="input-wrapper">
          <textarea
            ref={inputRef}
            rows={1}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
            placeholder="Posez votre question bancaire…"
            className="chat-textarea"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isLoading}
            className="send-btn"
          >
            <Send size={18} />
          </button>
        </div>

      </div>
    </div>
  );
}
