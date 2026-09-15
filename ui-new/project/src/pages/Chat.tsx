import { useState, useEffect, useRef } from 'react';
import { Send, PlusCircle, Zap, Shield, Bot, ChevronRight, Sparkles, Activity } from 'lucide-react';
import MessageBubble from '../components/MessageBubble';
import TypingIndicator from '../components/TypingIndicator';
import { askQuestion, getSessionHistory, getJobStatus } from '../services/api';
import { clearSession, getSessionId } from '../utils/session';
import type { Message } from '../types';
import { routeQuestion } from '../utils/chatRouter';
import { useSettings } from '../context/SettingsContext';

const QUICK_QUESTIONS = [
  { label: "Consulter mon solde", icon: "💳", color: "#00b2c6", bg: "rgba(0,178,198,0.12)" },
  { label: "Débloquer ma carte", icon: "🔓", color: "#10b981", bg: "rgba(16,185,129,0.12)" },
  { label: "Faire un virement", icon: "💸", color: "#8b5cf6", bg: "rgba(139,92,246,0.12)" },
  { label: "Activer dotation e-commerce", icon: "🌐", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
];

const CLASSIFICATION_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  'N1-RR': { label: 'N1-RR · RPA Actif', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  'N1-IN': { label: 'N1-IN · IA Auto', color: '#00b2c6', bg: 'rgba(0,178,198,0.1)' },
  'N1-HR': { label: 'N1-HR · Intervention', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  'N2':    { label: 'N2 · Expert Monétique', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
};

export default function Chat() {
  const { t } = useSettings();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(() => getSessionId());
  const [classificationTag, setClassificationTag] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
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
      const userStr = localStorage.getItem('boa_bank_current_user');
      const user = userStr ? JSON.parse(userStr) : null;
      const card = user?.cartes?.[0];

      const resp = await askQuestion(text, sessionId, user?.solde, user?.numeroCompte, user?.email, user?.numeroCompte, user?.motDePasse, card?.bloquee, card?.dotationEcommerce, card?.dotationTouristique);
      
      const botMsgId = `b-${Date.now()}`;
      setMessages(prev => [...prev, { id: botMsgId, question: '', answer: resp.answer, confidence: resp.confidence || 0.9, timestamp: new Date(), isUser: false }]);
      if (resp.source) setClassificationTag(resp.source.startsWith('RPA') ? 'N1-RR' : 'N1-IN');
      if (resp.source === 'RPA_STARTED' && resp.jobKey) pollJobStatus(resp.jobKey, botMsgId);
    } catch (error) {
      setMessages(prev => [...prev, { id: `e-${Date.now()}`, question: '', answer: t("Une erreur réseau s'est produite. Vérifiez que votre serveur Java est lancé sur le port 8081."), confidence: 0, timestamp: new Date(), isUser: false }]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const pollJobStatus = async (jobKey: string, messageId: string) => {
    let attempts = 0, consecutiveErrors = 0;
    setMessages(prev => prev.map(m => m.id === messageId ? { ...m, answer: m.answer + "\n\n⏳ *" + t("Traitement en cours par le robot...") + "*" } : m));
    const interval = setInterval(async () => {
      attempts++;
      if (attempts > 25) { clearInterval(interval); return; }
      try {
        const statusData = await getJobStatus(jobKey);
        consecutiveErrors = 0;
        const job = statusData.value?.[0];
        const state = job?.State;
        if (state === 'Successful') {
          clearInterval(interval);
          const outputStr = job?.OutputArguments;
          let customMessage = "";
          if (outputStr) { try { const outputs = JSON.parse(outputStr); customMessage = outputs.out_ResultText || outputs.out_Message || outputs.out_Result; } catch (e) {} }
          const successMsg = customMessage 
            ? `✅ **${t("Message du robot RPA :")}**\n\n${customMessage}`
            : `✅ **${t("Opération effectuée avec succès !")}**\n\n${t("Le robot RPA a terminé le traitement bancaire.")}`;
          setMessages(prev => prev.map(m => m.id === messageId ? { ...m, answer: successMsg } : m));
        } else if (state === 'Faulted' || state === 'Canceled') {
          clearInterval(interval);
          const errorMsg = `❌ **${t("Échec technique de l'automate (RPA)")}**\n\n${t("Statut : ")}` + state;
          setMessages(prev => prev.map(m => m.id === messageId ? { ...m, answer: errorMsg } : m));
        }
      } catch (e) { consecutiveErrors++; if (consecutiveErrors >= 3) clearInterval(interval); }
    }, 3000);
  };

  const handleNewChat = () => { clearSession(); setSessionId(getSessionId()); setMessages([]); setClassificationTag(null); };
  const botCount = messages.filter(m => !m.isUser).length;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-deep)', fontFamily: 'var(--font-body)', overflow: 'hidden', position: 'relative' }}>

      {/* Ambient Background Orbs */}
      <div style={{position:'absolute',top:'-10%',left:'-5%',width:'40%',height:'50%',background:'radial-gradient(circle, var(--accent-dim) 0%, transparent 65%)',pointerEvents:'none',zIndex:0}} />
      <div style={{position:'absolute',bottom:'10%',right:'-5%',width:'35%',height:'40%',background:'radial-gradient(circle, rgba(0,47,108,0.05) 0%, transparent 65%)',pointerEvents:'none',zIndex:0}} />

      {/* ── HEADER ── */}
      <header style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'0 28px', height:'68px', flexShrink:0, position:'relative', zIndex:10,
        background:'var(--bg-surface)', backdropFilter:'blur(20px)',
        borderBottom:'1px solid var(--border)',
        boxShadow:'0 4px 20px rgba(0,0,0,0.05)'
      }}>
        {/* Brand */}
        <div style={{display:'flex',alignItems:'center',gap:'14px'}}>
          <div style={{
            width:'42px',height:'42px',
            background:'linear-gradient(135deg, var(--accent) 0%, #002f6c 100%)',
            borderRadius:'14px', display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:'0 0 24px rgba(0,178,198,0.4), 0 4px 12px rgba(0,0,0,0.3)',
            border:'1px solid rgba(0,178,198,0.3)'
          }}>
            <Bot size={22} color="#fff" />
          </div>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
              <span style={{fontWeight:800,fontSize:'15px',color:'var(--text-primary)',letterSpacing:'-0.3px'}}>Bank Of Africa</span>
              <span style={{
                fontSize:'9px',fontWeight:800,letterSpacing:'1.5px',textTransform:'uppercase',
                background:'var(--accent-dim)',
                color:'var(--accent)', padding:'3px 9px', borderRadius:'999px',
                border:'1px solid var(--border-light)'
              }}>{t("ASSISTANCE IA")}</span>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:'7px',marginTop:'3px'}}>
              <span style={{
                width:'7px',height:'7px',background:'var(--green)',borderRadius:'50%',
                boxShadow:'0 0 10px var(--green)',
                animation:'pulse-dot 2s ease-in-out infinite'
              }} />
              <span style={{fontSize:'11px',color:'var(--text-muted)',fontWeight:500}}>{t("En ligne · Modèle NLP + RPA actif")}</span>
            </div>
          </div>
        </div>

        {/* Right actions */}
        <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
          {classificationTag && CLASSIFICATION_LABELS[classificationTag] && (
            <div style={{
              display:'flex',alignItems:'center',gap:'6px',
              color: CLASSIFICATION_LABELS[classificationTag].color,
              background: CLASSIFICATION_LABELS[classificationTag].bg,
              border:`1px solid ${CLASSIFICATION_LABELS[classificationTag].color}40`,
              padding:'5px 14px', borderRadius:'999px', fontSize:'11px', fontWeight:700,
              boxShadow:`0 0 12px ${CLASSIFICATION_LABELS[classificationTag].color}20`
            }}>
              <Activity size={12} />
              {CLASSIFICATION_LABELS[classificationTag].label}
            </div>
          )}
          <div style={{
            display:'flex',alignItems:'center',gap:'7px',
            background:'var(--bg-hover)', border:'1px solid var(--border)',
            color:'var(--text-secondary)', padding:'6px 14px', borderRadius:'999px', fontSize:'12px', fontWeight:600
          }}>
            <Zap size={13} style={{color:'var(--accent)'}} />
            {botCount} {t("réponses")}
          </div>
          <button onClick={handleNewChat} style={{
            display:'flex',alignItems:'center',gap:'8px',
            background:'linear-gradient(135deg, var(--accent) 0%, #002f6c 100%)',
            color:'white', border:'none', padding:'9px 20px', borderRadius:'999px',
            fontSize:'13px', fontWeight:700, cursor:'pointer',
            boxShadow:'0 4px 15px rgba(0,0,0,0.1)',
            transition:'all 0.2s'
          }}>
            <PlusCircle size={16} />
            {t("Nouvelle Session")}
          </button>
        </div>
      </header>

      {/* ── MESSAGES AREA ── */}
      <div style={{flex:1,overflowY:'auto',padding:'16px 24px',position:'relative',zIndex:1}}>
        <div style={{maxWidth:'820px',margin:'0 auto'}}>

          {/* Welcome screen */}
          {messages.length === 0 && (
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center',padding:'12px 16px 8px',position:'relative'}}>
              
              {/* Glow behind icon */}
              <div style={{position:'absolute',top:0,left:'50%',transform:'translateX(-50%)',width:'600px',height:'200px',background:'radial-gradient(ellipse, var(--accent-dim) 0%, transparent 65%)',pointerEvents:'none'}} />

              {/* Big animated icon */}
              <div style={{
                width:'48px',height:'48px',
                background:'linear-gradient(135deg, var(--accent) 0%, #002f6c 100%)',
                borderRadius:'14px', display:'flex', alignItems:'center', justifyContent:'center',
                marginBottom:'10px',
                boxShadow:'0 4px 15px rgba(0,0,0,0.1)',
                border:'1px solid var(--border-light)',
                position:'relative', zIndex:1
              }}>
                <Sparkles size={20} color="#fff" />
                {/* Corner glow */}
                <div style={{position:'absolute',inset:'-1px',borderRadius:'14px',background:'linear-gradient(135deg, rgba(0,178,198,0.4), transparent 50%)',pointerEvents:'none'}} />
              </div>

              {/* Title */}
              <h2 style={{
                fontSize:'24px', fontWeight:900, marginBottom:'6px', lineHeight:1.1,
                color: 'var(--text-primary)',
                letterSpacing:'-0.5px'
              }}>
                {t("Bonjour, comment puis-je vous aider ?")}
              </h2>
              <p style={{color:'var(--text-secondary)',fontSize:'12.5px',marginBottom:'18px',maxWidth:'450px',lineHeight:'1.5'}}>
                {t("Votre assistant bancaire intelligent, disponible 24h/24. Posez votre question ou choisissez une action ci-dessous.")}
              </p>

              {/* Quick action cards */}
              <div style={{display:'grid',gridTemplateColumns:'repeat(2, 1fr)',gap:'10px',width:'100%',maxWidth:'600px',marginBottom:'18px'}}>
                {QUICK_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(q.label)}
                    onMouseEnter={() => setHoveredCard(i)}
                    onMouseLeave={() => setHoveredCard(null)}
                    style={{
                      display:'flex', alignItems:'center', gap:'10px',
                      padding:'10px 14px', borderRadius:'12px', cursor:'pointer',
                      background: hoveredCard === i ? 'var(--bg-hover)' : 'var(--bg-card)',
                      border: `1px solid ${hoveredCard === i ? q.color + '50' : 'var(--border)'}`,
                      transform: hoveredCard === i ? 'translateY(-2px) scale(1.01)' : 'translateY(0) scale(1)',
                      boxShadow: hoveredCard === i ? `0 10px 20px rgba(0,0,0,0.05), 0 0 20px ${q.color}20` : '0 4px 12px rgba(0,0,0,0.02)',
                      transition:'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                      textAlign:'left'
                    }}
                  >
                    {/* Icon container */}
                    <div style={{
                      width:'32px',height:'32px',borderRadius:'8px',
                      background: q.bg, border:`1px solid ${q.color}30`,
                      display:'flex',alignItems:'center',justifyContent:'center',
                      fontSize:'16px', flexShrink:0,
                      boxShadow: hoveredCard === i ? `0 0 12px ${q.color}30` : 'none',
                      transition:'all 0.25s'
                    }}>
                      {q.icon}
                    </div>
                    <span style={{fontWeight:600,fontSize:'12px',color: hoveredCard === i ? 'var(--text-primary)' : 'var(--text-secondary)',flex:1,transition:'color 0.2s'}}>
                      {t(q.label)}
                    </span>
                    <ChevronRight size={14} style={{color: hoveredCard === i ? q.color : '#2a3a50', transition:'all 0.2s', transform: hoveredCard === i ? 'translateX(2px)' : 'translateX(0)'}} />
                  </button>
                ))}
              </div>

              {/* Trust badges */}
              <div style={{display:'flex',gap:'20px',flexWrap:'wrap',justifyContent:'center'}}>
                {[
                  {icon:<Shield size={11}/>, label: t('Chiffré SSL'), color:'#00b2c6'},
                  {icon:<Zap size={11}/>, label: t('RPA Temps réel'), color:'#10b981'},
                  {icon:<Bot size={11}/>, label: t('NLP Intelligent'), color:'#8b5cf6'},
                ].map((b,i) => (
                  <div key={i} style={{display:'flex',alignItems:'center',gap:'6px',fontSize:'9.5px',fontWeight:700,color:b.color,textTransform:'uppercase',letterSpacing:'0.8px',opacity:0.8}}>
                    {b.icon}{b.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
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
      <div style={{
        padding:'8px 20px 10px', flexShrink:0, position:'relative', zIndex:10,
        background:'var(--bg-surface)', backdropFilter:'blur(20px)',
        borderTop:'1px solid var(--border)'
      }}>
        <div style={{
          maxWidth:'820px', margin:'0 auto',
          display:'flex', alignItems:'center', gap:'10px',
          background:'var(--bg-card)', border:`1px solid ${inputValue.trim() ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius:'14px', padding:'6px 6px 6px 14px',
          boxShadow: inputValue.trim() ? '0 0 24px var(--accent-dim), 0 8px 32px rgba(0,0,0,0.05)' : '0 4px 20px rgba(0,0,0,0.05)',
          transition:'all 0.25s'
        }}>
          <textarea
            ref={inputRef}
            rows={1}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
            placeholder={t("Posez votre question bancaire…")}
            disabled={isLoading}
            style={{
              flex:1, background:'transparent', border:'none', outline:'none',
              padding:'6px 0', color:'var(--text-primary)', fontFamily:'var(--font-body)',
              fontSize:'14px', resize:'none', maxHeight:'120px',
              lineHeight:'1.4'
            }}
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isLoading}
            style={{
              width:'34px',height:'34px',
              background: inputValue.trim()
                ? 'linear-gradient(135deg, var(--accent) 0%, #002f6c 100%)'
                : 'var(--bg-hover)',
              border:`1px solid ${inputValue.trim() ? 'var(--accent)' : 'transparent'}`,
              borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center',
              cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
              color: inputValue.trim() ? '#fff' : 'var(--text-muted)',
              boxShadow: inputValue.trim() ? '0 4px 10px var(--accent-dim)' : 'none',
              transition:'all 0.25s', flexShrink:0
            }}
          >
            <Send size={15} />
          </button>
        </div>
        <p style={{textAlign:'center',fontSize:'9px',fontWeight:600,color:'var(--text-muted)',marginTop:'6px',textTransform:'uppercase',letterSpacing:'0.5px'}}>
          {t("BOA IA · Sécurisé · Données chiffrées BOA")}
        </p>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; box-shadow: 0 0 10px #00b2c6; }
          50% { opacity: 0.6; box-shadow: 0 0 4px #00b2c6; }
        }
      `}</style>
    </div>
  );
}
