import { useState, useEffect } from 'react';
import { 
  RefreshCw, Trash2, ArrowLeft, MessageCircle, Clock, TrendingUp, 
  ChevronDown, ChevronUp, Bot, Zap, Search, Filter, CheckCircle, 
  AlertTriangle, X, ShieldAlert
} from 'lucide-react';
import { clearHistory, getHistory } from '../services/api';
import type { Conversation } from '../types';
import { useSettings } from '../context/SettingsContext';

export default function History({ onBackToChat }: { onBackToChat: () => void }) {
  const { t } = useSettings();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'high' | 'mid' | 'low'>('all');

  const userStr = localStorage.getItem('boa_bank_current_user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => { loadHistory(); }, []);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const userEmail = user?.role === 'admin' ? undefined : user?.email;
      setConversations(await getHistory(userEmail));
    } catch { /* silent */ }
    finally { setIsLoading(false); }
  };

  const handleClear = async () => {
    if (!conversations.length || !confirm(t("Êtes-vous sûr de vouloir vider tout votre historique d'échanges ?"))) return;
    const userEmail = user?.role === 'admin' ? undefined : user?.email;
    await clearHistory(userEmail);
    setConversations([]);
  };

  const fmt = (d: string) => new Date(d).toLocaleDateString('fr-FR', { 
    day: '2-digit', 
    month: 'short', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  const confColor = (c: number) => c >= 0.85 ? '#10b981' : c >= 0.6 ? '#f59e0b' : '#ef4444';
  const confLabel = (c: number) => c >= 0.85 ? t('Précision Élevée') : c >= 0.6 ? t('Précision Moyenne') : t('À Réviser');
  const confGlow = (c: number) => c >= 0.85 ? 'rgba(16,185,129,0.25)' : c >= 0.6 ? 'rgba(245,158,11,0.25)' : 'rgba(239,68,68,0.25)';

  const sorted = [...conversations].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  
  // Apply search and filter
  const filtered = sorted.filter(c => {
    const textMatch = c.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      c.answer.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterType === 'high') return textMatch && c.confidence >= 0.85;
    if (filterType === 'mid') return textMatch && c.confidence >= 0.6 && c.confidence < 0.85;
    if (filterType === 'low') return textMatch && c.confidence < 0.6;
    return textMatch;
  });

  const avgConf = conversations.length ? conversations.reduce((s, c) => s + c.confidence, 0) / conversations.length : 0;
  const highConf = conversations.filter(c => c.confidence >= 0.85).length;
  const needReview = conversations.filter(c => c.confidence < 0.60).length;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-deep)', fontFamily: 'var(--font-body)', overflow: 'hidden', position: 'relative' }}>

      {/* Ambient background decoration */}
      <div style={{position:'absolute',top:'-10%',right:'-5%',width:'45%',height:'50%',background:'radial-gradient(circle, var(--accent-dim) 0%, transparent 65%)',pointerEvents:'none',zIndex:0}} />
      <div style={{position:'absolute',bottom:'5%',left:'-5%',width:'40%',height:'45%',background:'radial-gradient(circle, var(--accent-dim) 0%, transparent 65%)',pointerEvents:'none',zIndex:0}} />

      {/* ── HEADER ── */}
      <header style={{
        padding:'24px 32px 18px', flexShrink:0, position:'relative', zIndex:10,
        background:'var(--bg-surface)', backdropFilter:'blur(20px)',
        borderBottom:'1px solid var(--border)',
        boxShadow:'0 4px 15px rgba(0,0,0,0.05)'
      }}>

        {/* Header Title Bar */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'22px',flexWrap:'wrap',gap:'16px'}}>
          <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
            <button onClick={onBackToChat} style={{
              display:'flex', alignItems:'center', gap:'8px',
              background:'var(--bg-hover)', border:'1px solid var(--border)',
              color:'var(--accent)', padding:'7px 15px', borderRadius:'10px',
              fontSize:'12.5px', fontWeight:700, cursor:'pointer',
              transition:'all 0.25s',
              boxShadow:'0 2px 10px var(--accent-dim)'
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--border)'; (e.currentTarget as HTMLElement).style.transform = 'translateX(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'; (e.currentTarget as HTMLElement).style.transform = 'translateX(0)'; }}
            >
              <ArrowLeft size={14} /> {t("Retour au chat")}
            </button>
            <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
              <div style={{
                width:'38px',height:'38px',
                background:'linear-gradient(135deg, var(--accent) 0%, #002f6c 100%)',
                borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center',
                boxShadow:'0 0 16px var(--accent-dim)'
              }}>
                <Clock size={18} color="#fff" />
              </div>
              <div>
                <h1 style={{fontSize:'20px',fontWeight:900,color:'var(--text-primary)',letterSpacing:'-0.5px',lineHeight:1}}>{t("Historique des requêtes")}</h1>
                <p style={{fontSize:'10.5px',color:'var(--text-secondary)',marginTop:'3px',fontWeight:600}}>
                  {user?.role === 'admin' ? t('Supervision globale') : t('Mon compte')} · {conversations.length} {conversations.length !== 1 ? t('sessions') : t('session')}
                </p>
              </div>
            </div>
          </div>

          <div style={{display:'flex',gap:'10px'}}>
            <button onClick={loadHistory} disabled={isLoading} style={{
              display:'flex',alignItems:'center',gap:'6px',fontSize:'12px',fontWeight:700,
              padding:'8px 16px',borderRadius:'10px',cursor:'pointer',
              background:'var(--bg-hover)',color:'var(--text-secondary)',
              border:'1px solid var(--border)',transition:'all 0.2s'
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; (e.currentTarget as HTMLElement).style.background = 'var(--accent-dim)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'; }}
            >
              <RefreshCw size={13} className={isLoading ? 'spin' : ''} /> {t("Actualiser")}
            </button>
            <button onClick={handleClear} disabled={!conversations.length} style={{
              display:'flex',alignItems:'center',gap:'6px',fontSize:'12px',fontWeight:700,
              padding:'8px 16px',borderRadius:'10px',cursor:conversations.length ? 'pointer' : 'not-allowed',
              background:'rgba(239,68,68,0.06)',color:'#ef4444',
              border:'1px solid rgba(239,68,68,0.18)',transition:'all 0.2s',opacity:conversations.length ? 1 : 0.5
            }}
              onMouseEnter={e => { if (conversations.length) { (e.currentTarget as HTMLElement).style.background = '#ef4444'; (e.currentTarget as HTMLElement).style.color = '#fff'; } }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.06)'; (e.currentTarget as HTMLElement).style.color = '#ef4444'; }}
            >
              <Trash2 size={13} /> {t("Vider l'historique")}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))',gap:'12px',marginBottom:'20px'}}>
          {[
            { icon:<MessageCircle size={18}/>, val: conversations.length, label: t('Total Échanges'), color:'var(--accent)', bg:'var(--bg-card)' },
            { icon:<TrendingUp size={18}/>, val: `${(avgConf * 100).toFixed(0)}%`, label: t('Confiance Moyenne'), color:'var(--green)', bg:'var(--bg-card)' },
            { icon:<CheckCircle size={18}/>, val: highConf, label: t('Confiance Élevée'), color:'var(--purple)', bg:'var(--bg-card)' },
            { icon:<ShieldAlert size={18}/>, val: needReview, label: t('Requêtes à Réviser'), color:'var(--red)', bg:'var(--bg-card)' },
          ].map((s, i) => (
            <div key={i} style={{
              display:'flex', alignItems:'center', gap: '12px',
              background: s.bg, border:`1px solid var(--border)`,
              borderRadius:'12px', padding:'10px 16px',
              boxShadow:'0 4px 12px rgba(0,0,0,0.03)',
              position:'relative', overflow:'hidden'
            }}>
              {/* Corner accent glow */}
              <div style={{position:'absolute',right:'-10px',bottom:'-10px',width:'40px',height:'40px',borderRadius:'50%',background:s.color,opacity:0.1,filter:'blur(10px)'}} />
              <div style={{color:s.color,background:`${s.color}15`,borderRadius:'8px',width:'32px',height:'32px',display:'flex',alignItems:'center',justifyContent:'center'}}>{s.icon}</div>
              <div>
                <div style={{fontSize:'18px',fontWeight:900,color:s.color,lineHeight:1.1,fontFamily:'var(--font-display)'}}>{s.val}</div>
                <div style={{fontSize:'9.5px',fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'0.5px',marginTop:'3px'}}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filters Bar */}
        <div style={{
          display:'flex',alignItems:'center',justifyContent:'space-between',gap:'16px',flexWrap:'wrap',
          paddingTop:'12px',borderTop:'1px solid var(--border)'
        }}>
          {/* Search bar */}
          <div style={{position:'relative',flex:'1',minWidth:'240px',maxWidth:'360px'}}>
            <Search size={14} style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',color:'var(--text-muted)'}} />
            <input 
              type="text" 
              placeholder={t("Rechercher dans les questions ou réponses...")}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                width:'100%',boxSizing:'border-box',
                background:'var(--bg-hover)', border:'1px solid var(--border)',
                borderRadius:'8px', padding:'7px 12px 7px 34px',
                fontSize:'12.5px', color:'var(--text-primary)', outline:'none',
                transition:'all 0.25s',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--bg-card)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-hover)'; }}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                style={{position:'absolute',right:'10px',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:'var(--text-secondary)',cursor:'pointer',display:'flex',alignItems:'center'}}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
            <span style={{fontSize:'11px',fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase',display:'flex',alignItems:'center',gap:'5px'}}>
              <Filter size={11} /> {t("Filtrer :")}
            </span>
            {[
              { id:'all', label: t('Tous') },
              { id:'high', label: t('Confiance Élevée'), count: highConf, color:'var(--green)' },
              { id:'mid', label: t('Moyenne'), count: conversations.filter(c => c.confidence >= 0.6 && c.confidence < 0.85).length, color:'var(--amber)' },
              { id:'low', label: t('À réviser'), count: needReview, color:'var(--red)' }
            ].map(pill => {
              const isActive = filterType === pill.id;
              return (
                <button
                  key={pill.id}
                  onClick={() => setFilterType(pill.id as any)}
                  style={{
                    border:'none', padding:'6px 12px', borderRadius:'8px',
                    fontSize:'11.5px', fontWeight:700, cursor:'pointer',
                    background: isActive ? 'var(--accent)' : 'var(--bg-hover)',
                    color: isActive ? '#fff' : 'var(--text-secondary)',
                    borderWidth:'1px', borderStyle:'solid',
                    borderColor: isActive ? 'var(--accent)' : 'var(--border)',
                    transition:'all 0.2s', display:'flex', alignItems:'center', gap:'6px'
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--border)'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                >
                  {pill.label}
                  {pill.count !== undefined && (
                    <span style={{
                      fontSize:'9px', padding:'1px 5px', borderRadius:'50px',
                      background: isActive ? 'rgba(255,255,255,0.2)' : (pill.color ? `${pill.color}20` : 'rgba(255,255,255,0.1)'),
                      color: isActive ? '#fff' : (pill.color || '#fff'),
                      fontWeight:800
                    }}>
                      {pill.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </header>

      {/* ── CONTENT (LIST OF CARDS) ── */}
      <div style={{flex:1,overflowY:'auto',padding:'20px 32px',position:'relative',zIndex:1}} className="custom-scrollbar">
        {isLoading ? (
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'240px',gap:'12px',color:'var(--text-secondary)'}}>
            <div style={{width:'32px',height:'32px',border:'3px solid var(--accent-dim)',borderTopColor:'var(--accent)',borderRadius:'50%',animation:'spin 1s linear infinite'}} />
            <span style={{fontSize:'13px',fontWeight:600}}>{t("Chargement de l'historique…")}</span>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'240px',gap: '12px'}}>
            <div style={{
              width:'60px',height:'60px',
              background:'var(--accent-dim)', border:'1px solid var(--border)',
              borderRadius:'16px', display:'flex', alignItems:'center', justifyContent:'center'
            }}>
              <MessageCircle size={26} color="var(--accent)" strokeWidth={1.5} />
            </div>
            <p style={{color:'var(--text-secondary)',fontSize:'13px',fontWeight:600,margin:0}}>{t("Aucune conversation correspondante")}</p>
            <p style={{color:'var(--text-muted)',fontSize:'11.5px',margin:0}}>{t("Modifiez vos critères de recherche ou de filtre.")}</p>
          </div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:'10px',maxWidth:'820px',margin:'0 auto'}}>
            {filtered.map((conv) => {
              const isOpen = selected === conv.id;
              const isHovered = hoveredCard === conv.id;
              const color = confColor(conv.confidence);
              const glow = confGlow(conv.confidence);

              return (
                <div
                  key={conv.id}
                  onClick={() => setSelected(isOpen ? null : conv.id)}
                  onMouseEnter={() => setHoveredCard(conv.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    background: isOpen ? 'var(--bg-surface)' : isHovered ? 'var(--bg-hover)' : 'var(--bg-card)',
                    border: `1px solid ${isOpen ? 'var(--accent)' : isHovered ? 'var(--border)' : 'var(--border-light)'}`,
                    borderRadius:'14px',
                    overflow:'hidden',
                    cursor:'pointer',
                    transition:'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                    boxShadow: isOpen ? `0 8px 30px rgba(0,0,0,0.1), 0 0 16px var(--accent-dim)` : isHovered ? '0 4px 16px rgba(0,0,0,0.05)' : '0 2px 8px rgba(0,0,0,0.02)',
                    transform: isHovered && !isOpen ? 'translateY(-1.5px)' : 'translateY(0)',
                  }}
                >
                  {/* Left accent bar dynamically matching confidence level */}
                  <div style={{display:'flex'}}>
                    <div style={{width:'4px',background:`linear-gradient(to bottom, ${color}, ${color}40)`,borderRadius:'14px 0 0 14px',flexShrink:0,transition:'all 0.3s'}} />
                    <div style={{flex:1,padding:'14px 18px'}}>

                      {/* Header block inside card */}
                      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:'12px'}}>
                        <div style={{flex:1}}>
                          <p style={{
                            fontSize:'13.5px', fontWeight:600, color: isOpen || isHovered ? 'var(--text-primary)' : 'var(--text-secondary)',
                            lineHeight:'1.5', marginBottom:'8px',
                            transition:'color 0.2s'
                          }}>
                            {conv.question}
                          </p>
                          <div style={{display:'flex',alignItems:'center',gap:'10px',flexWrap:'wrap'}}>
                            {/* Confidence rating badge */}
                            <span style={{
                              display:'inline-flex', alignItems:'center', gap:'4px',
                              fontSize:'10px', fontWeight:800,
                              color, background:`${color}12`,
                              border:`1px solid ${color}25`,
                              padding:'2.5px 8px', borderRadius:'999px',
                              boxShadow: isOpen ? `0 0 8px ${glow}` : 'none',
                              transition:'all 0.25s'
                            }}>
                              <span style={{width:'5px',height:'5px',borderRadius:'50%',background:color,display:'inline-block'}} />
                              {confLabel(conv.confidence)} · {(conv.confidence * 100).toFixed(0)}%
                            </span>
                            {/* Timestamp indicator */}
                            <span style={{fontSize:'10.5px',color:'var(--text-muted)',display:'flex',alignItems:'center',gap:'4px'}}>
                              <Clock size={11} />{fmt(conv.created_at)}
                            </span>
                          </div>
                        </div>
                        <div style={{color:'var(--text-muted)',transition:'transform 0.3s',transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',flexShrink:0,marginTop:'2px'}}>
                          <ChevronDown size={16} style={{color: isOpen ? 'var(--accent)' : 'var(--text-muted)'}} />
                        </div>
                      </div>

                      {/* Conversation thread details expanded */}
                      {isOpen && (
                        <div style={{
                          marginTop:'14px', paddingTop:'14px',
                          borderTop:'1px solid rgba(255,255,255,0.06)',
                          animation:'fadeSlideIn 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                          display:'flex', flexDirection:'column', gap:'12px'
                        }}
                          onClick={e => e.stopPropagation()} // Prevent closing when clicking inner bubbles
                        >
                          {/* Mock conversation snippet thread */}
                          
                          {/* User Message Bubble */}
                          <div style={{display:'flex', justifyContent:'flex-end', gap:'8px'}}>
                            <div style={{
                              background:'linear-gradient(135deg, var(--accent) 0%, #002f6c 100%)',
                              border:'1px solid var(--border)',
                              borderRadius:'14px 14px 2px 14px',
                              padding:'10px 14px', maxWidth:'80%',
                              color:'#fff', fontSize:'12.5px', lineHeight:1.5,
                              boxShadow:'0 2px 6px rgba(0,0,0,0.1)'
                            }}>
                              {conv.question}
                            </div>
                            <div style={{
                              width:'28px',height:'28px',borderRadius:'50%',
                              background:'var(--bg-card)', border:'1px solid var(--border)',
                              display:'flex',alignItems:'center',justifyContent:'center',
                              fontSize:'11px',fontWeight:700,color:'var(--accent)',flexShrink:0
                            }}>
                              {user?.nom ? user.nom.charAt(0).toUpperCase() : 'U'}
                            </div>
                          </div>

                          {/* Bot Message Bubble */}
                          <div style={{display:'flex', justifyContent:'flex-start', gap:'8px'}}>
                            <div style={{
                              width:'28px',height:'28px',borderRadius:'50%',
                              background:'linear-gradient(135deg, var(--accent) 0%, #002f6c 100%)',
                              display:'flex',alignItems:'center',justifyContent:'center',
                              flexShrink:0, boxShadow:'0 0 8px var(--accent-dim)'
                            }}>
                              <Bot size={14} color="#fff" />
                            </div>
                            <div style={{
                              background:'var(--bg-card)',
                              border:'1px solid var(--border)',
                              borderRadius:'2px 14px 14px 14px',
                              padding:'10px 14px', maxWidth:'80%',
                              boxShadow:'0 2px 6px rgba(0,0,0,0.05)',
                              display:'flex', flexDirection:'column', gap:'6px'
                            }}>
                              <div style={{
                                display:'flex',alignItems:'center',gap:'6px',
                                fontSize:'9px',fontWeight:800,color:'var(--accent)',
                                textTransform:'uppercase',letterSpacing:'0.8px'
                              }}>
                                <span>{t("Assistant BOA")}</span>
                                <span style={{width:'3px',height:'3px',borderRadius:'50%',background:'var(--border)'}} />
                                <span style={{color}}>{t("Précision")} : {(conv.confidence * 100).toFixed(0)}%</span>
                              </div>
                              <p style={{
                                fontSize:'13px',color:'var(--text-secondary)',lineHeight:'1.6',
                                margin:0, whiteSpace:'pre-wrap'
                              }}>
                                {conv.answer}
                              </p>
                            </div>
                          </div>

                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }

        /* Custom scrollbar styling */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: var(--bg-hover);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 99px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--accent);
        }
      `}</style>
    </div>
  );
}
