import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Globe, Moon, Sun, Monitor, CheckCircle, ArrowLeft, User, Lock, Bell, Palette } from 'lucide-react';
import { useSettings, Theme, Language } from '../context/SettingsContext';
import { BankUser } from '../utils/BankStorage';

export default function Settings({ onBackToChat }: { onBackToChat: () => void }) {
  const { theme, language, setTheme, setLanguage, t } = useSettings();
  const [selectedTheme, setSelectedTheme] = useState<Theme>(theme);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [activeTab, setActiveTab] = useState<'compte' | 'securite' | 'notifications' | 'apparence'>('compte');

  const [currentUser, setCurrentUser] = useState<BankUser | null>(() => {
    const userStr = localStorage.getItem('boa_bank_current_user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        console.error("Error parsing user data");
      }
    }
    return null;
  });

  const handleSave = () => {
    setTheme(selectedTheme);
    setLanguage(selectedLanguage);
    setShowConfirmation(true);
    setTimeout(() => {
      setShowConfirmation(false);
    }, 3000);
  };

  const tabs = [
    { id: 'compte', label: t('Compte'), icon: <User size={18} /> },
    { id: 'securite', label: t('Sécurité'), icon: <Lock size={18} /> },
    { id: 'notifications', label: t('Notifications'), icon: <Bell size={18} /> },
    { id: 'apparence', label: t('Apparence & Langue'), icon: <Palette size={18} /> }
  ];

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
              borderRadius:'10px', display:'flex', alignItems:'center', justifyContext:'center',
              justifyContent:'center',
              boxShadow:'0 0 16px var(--accent-dim)'
            }}>
              <SettingsIcon size={18} color="#fff" />
            </div>
            <div>
              <h1 style={{fontSize:'20px',fontWeight:900,color:'var(--text-primary)',letterSpacing:'-0.5px',lineHeight:1}}>{t("Paramètres")}</h1>
              <p style={{fontSize:'10.5px',color:'var(--text-secondary)',marginTop:'4px',fontWeight:600}}>
                BOA Assitance · {t("Paramètres")}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ── CONTENT ── */}
      <div style={{flex:1, overflowY:'auto', padding:'32px', position:'relative', zIndex:1}}>
        <div style={{maxWidth:'850px', margin:'0 auto', display:'flex', gap:'32px', alignItems:'flex-start'}}>
          
          {/* Tabs Sidebar */}
          <div style={{
            width:'240px',
            flexShrink:0,
            display:'flex',
            flexDirection:'column',
            gap:'8px'
          }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  display:'flex', alignItems:'center', gap:'12px',
                  padding:'14px 18px', borderRadius:'12px',
                  background: activeTab === tab.id ? 'var(--accent-dim)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-secondary)',
                  border: 'none', cursor:'pointer', fontSize:'14px', fontWeight:700,
                  transition:'all 0.2s', textAlign:'left'
                }}
                onMouseEnter={e => {
                  if (activeTab !== tab.id) {
                    (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)';
                    (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={e => {
                  if (activeTab !== tab.id) {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                    (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                  }
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{
            flex:1,
            background:'var(--bg-surface)',
            border:'1px solid var(--border)',
            borderRadius:'16px',
            padding:'32px',
            boxShadow:'0 8px 30px rgba(0,0,0,0.04)',
            display:'flex',
            flexDirection:'column',
            gap:'24px'
          }}>
            
            {activeTab === 'compte' && (
              <div style={{display:'flex', flexDirection:'column', gap:'24px'}}>
                <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
                  <div style={{width:'48px', height:'48px', borderRadius:'50%', background:'var(--accent-dim)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--accent)'}}>
                    <User size={24} />
                  </div>
                  <div>
                    <h2 style={{fontSize:'18px', fontWeight:800, color:'var(--text-primary)'}}>{t("Mon Compte")}</h2>
                    <p style={{fontSize:'13px', color:'var(--text-secondary)'}}>{t("Gérez vos informations personnelles")}</p>
                  </div>
                </div>
                
                <div style={{display:'flex', flexDirection:'column', gap:'16px'}}>
                  <div>
                    <label style={{display:'block', fontSize:'13px', fontWeight:700, color:'var(--text-secondary)', marginBottom:'8px'}}>{t("Nom complet")}</label>
                    <input type="text" defaultValue={currentUser ? `${currentUser.prenom} ${currentUser.nom}`.trim() : ""} style={{width:'100%', padding:'12px 16px', borderRadius:'10px', border:'1px solid var(--border)', background:'var(--bg-deep)', color:'var(--text-primary)', fontSize:'14px', outline:'none', transition:'border-color 0.2s'}} onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'} onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'} />
                  </div>
                  <div>
                    <label style={{display:'block', fontSize:'13px', fontWeight:700, color:'var(--text-secondary)', marginBottom:'8px'}}>{t("Adresse Email")}</label>
                    <input type="email" defaultValue={currentUser?.email || ""} style={{width:'100%', padding:'12px 16px', borderRadius:'10px', border:'1px solid var(--border)', background:'var(--bg-deep)', color:'var(--text-primary)', fontSize:'14px', outline:'none', transition:'border-color 0.2s'}} onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'} onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'} />
                  </div>
                  <div>
                    <label style={{display:'block', fontSize:'13px', fontWeight:700, color:'var(--text-secondary)', marginBottom:'8px'}}>{t("Numéro de téléphone")}</label>
                    <input type="tel" defaultValue={currentUser?.telephone || ""} style={{width:'100%', padding:'12px 16px', borderRadius:'10px', border:'1px solid var(--border)', background:'var(--bg-deep)', color:'var(--text-primary)', fontSize:'14px', outline:'none', transition:'border-color 0.2s'}} onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'} onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'securite' && (
              <div style={{display:'flex', flexDirection:'column', gap:'24px'}}>
                <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
                  <div style={{width:'48px', height:'48px', borderRadius:'50%', background:'var(--accent-dim)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--accent)'}}>
                    <Lock size={24} />
                  </div>
                  <div>
                    <h2 style={{fontSize:'18px', fontWeight:800, color:'var(--text-primary)'}}>{t("Sécurité")}</h2>
                    <p style={{fontSize:'13px', color:'var(--text-secondary)'}}>{t("Modifiez votre mot de passe")}</p>
                  </div>
                </div>
                
                <div style={{display:'flex', flexDirection:'column', gap:'16px'}}>
                  <div>
                    <label style={{display:'block', fontSize:'13px', fontWeight:700, color:'var(--text-secondary)', marginBottom:'8px'}}>{t("Mot de passe actuel")}</label>
                    <input type="password" placeholder="••••••••" style={{width:'100%', padding:'12px 16px', borderRadius:'10px', border:'1px solid var(--border)', background:'var(--bg-deep)', color:'var(--text-primary)', fontSize:'14px', outline:'none', transition:'border-color 0.2s'}} onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'} onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'} />
                  </div>
                  <div>
                    <label style={{display:'block', fontSize:'13px', fontWeight:700, color:'var(--text-secondary)', marginBottom:'8px'}}>{t("Nouveau mot de passe")}</label>
                    <input type="password" placeholder="••••••••" style={{width:'100%', padding:'12px 16px', borderRadius:'10px', border:'1px solid var(--border)', background:'var(--bg-deep)', color:'var(--text-primary)', fontSize:'14px', outline:'none', transition:'border-color 0.2s'}} onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'} onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'} />
                  </div>
                  <div>
                    <label style={{display:'block', fontSize:'13px', fontWeight:700, color:'var(--text-secondary)', marginBottom:'8px'}}>{t("Confirmer le nouveau mot de passe")}</label>
                    <input type="password" placeholder="••••••••" style={{width:'100%', padding:'12px 16px', borderRadius:'10px', border:'1px solid var(--border)', background:'var(--bg-deep)', color:'var(--text-primary)', fontSize:'14px', outline:'none', transition:'border-color 0.2s'}} onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'} onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div style={{display:'flex', flexDirection:'column', gap:'24px'}}>
                <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
                  <div style={{width:'48px', height:'48px', borderRadius:'50%', background:'var(--accent-dim)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--accent)'}}>
                    <Bell size={24} />
                  </div>
                  <div>
                    <h2 style={{fontSize:'18px', fontWeight:800, color:'var(--text-primary)'}}>{t("Notifications")}</h2>
                    <p style={{fontSize:'13px', color:'var(--text-secondary)'}}>{t("Gérez vos préférences d'alertes")}</p>
                  </div>
                </div>
                
                <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>
                  {[
                    { title: t("Notifications par email"), desc: t("Recevoir un résumé des activités par email") },
                    { title: t("Notifications SMS"), desc: t("Alertes importantes par SMS") },
                    { title: t("Alertes de sécurité"), desc: t("Être notifié des connexions non reconnues") },
                    { title: t("Mises à jour du compte"), desc: t("Informations sur les nouvelles fonctionnalités") }
                  ].map((notif, idx) => (
                    <label key={idx} style={{display:'flex', alignItems:'flex-start', gap:'12px', cursor:'pointer', padding:'12px', borderRadius:'10px', background:'var(--bg-deep)', border:'1px solid var(--border)'}}>
                      <div style={{marginTop:'2px'}}>
                        <input type="checkbox" defaultChecked={idx !== 1} style={{width:'18px', height:'18px', accentColor:'var(--accent)', cursor:'pointer'}} />
                      </div>
                      <div style={{display:'flex', flexDirection:'column'}}>
                        <span style={{fontSize:'14px', color:'var(--text-primary)', fontWeight:700}}>{notif.title}</span>
                        <span style={{fontSize:'12px', color:'var(--text-secondary)', marginTop:'4px'}}>{notif.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'apparence' && (
              <div style={{display:'flex', flexDirection:'column', gap:'24px'}}>
                <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
                  <div style={{width:'48px', height:'48px', borderRadius:'50%', background:'var(--accent-dim)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--accent)'}}>
                    <Palette size={24} />
                  </div>
                  <div>
                    <h2 style={{fontSize:'18px', fontWeight:800, color:'var(--text-primary)'}}>{t("Apparence & Langue")}</h2>
                    <p style={{fontSize:'13px', color:'var(--text-secondary)'}}>{t("Personnalisez votre interface")}</p>
                  </div>
                </div>
                
                {/* Theme Selection */}
                <div>
                  <label style={{display:'flex', alignItems:'center', gap:'8px', fontSize:'13px', fontWeight:700, color:'var(--text-primary)', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'12px'}}>
                    <Moon size={16} style={{color:'var(--accent)'}} />
                    {t("Thème d'affichage")}
                  </label>
                  <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'12px'}}>
                    {[
                      { id: 'light', label: t('Clair'), icon: <Sun size={18} /> },
                      { id: 'dark', label: t('Sombre'), icon: <Moon size={18} /> },
                      { id: 'auto', label: t('Automatique'), icon: <Monitor size={18} /> }
                    ].map(tOption => {
                      const isSel = selectedTheme === tOption.id;
                      return (
                        <button
                          key={tOption.id}
                          onClick={() => setSelectedTheme(tOption.id as Theme)}
                          style={{
                            padding:'14px 10px',
                            borderRadius:'12px',
                            background: isSel ? 'var(--accent-dim)' : 'var(--bg-deep)',
                            border:`1px solid ${isSel ? 'var(--accent)' : 'var(--border)'}`,
                            color: isSel ? 'var(--accent)' : 'var(--text-primary)',
                            fontSize:'12.5px',
                            fontWeight:700,
                            cursor:'pointer',
                            display:'flex',
                            flexDirection:'column',
                            alignItems:'center',
                            gap: '8px',
                            transition:'all 0.2s'
                          }}
                        >
                          <div style={{color: isSel ? 'var(--accent)' : 'var(--text-secondary)'}}>{tOption.icon}</div>
                          <span>{tOption.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Divider */}
                <div style={{height:'1px', background:'var(--border)'}} />

                {/* Language Selection */}
                <div>
                  <label style={{display:'flex', alignItems:'center', gap:'8px', fontSize:'13px', fontWeight:700, color:'var(--text-primary)', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'12px'}}>
                    <Globe size={16} style={{color:'var(--accent)'}} />
                    {t("Langue de l'application")}
                  </label>
                  <div style={{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'12px'}}>
                    {[
                      { id: 'fr', label: t('Français'), flag: '🇫🇷' },
                      { id: 'en', label: t('Anglais'), flag: '🇬🇧' }
                    ].map(lang => {
                      const isSel = selectedLanguage === lang.id;
                      return (
                        <button
                          key={lang.id}
                          onClick={() => setSelectedLanguage(lang.id as Language)}
                          style={{
                            padding:'14px',
                            borderRadius:'12px',
                            background: isSel ? 'var(--accent-dim)' : 'var(--bg-deep)',
                            border:`1px solid ${isSel ? 'var(--accent)' : 'var(--border)'}`,
                            color: isSel ? 'var(--accent)' : 'var(--text-primary)',
                            fontSize:'14px',
                            fontWeight:700,
                            cursor:'pointer',
                            display:'flex',
                            alignItems:'center',
                            justifyContent:'center',
                            gap: '8px',
                            transition:'all 0.2s'
                          }}
                        >
                          <span style={{fontSize:'18px'}}>{lang.flag}</span>
                          <span>{lang.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Save Button & Toast - Pinned at bottom of content area */}
            <div style={{marginTop:'auto', paddingTop:'24px', display:'flex', flexDirection:'column', gap:'12px'}}>
              <div style={{height:'1px', background:'var(--border)', marginBottom:'12px'}} />
              <button
                onClick={handleSave}
                style={{
                  background:'linear-gradient(135deg, var(--accent) 0%, #002f6c 100%)',
                  color:'#fff',
                  border:'none',
                  borderRadius:'12px',
                  padding:'14px',
                  fontSize:'14px',
                  fontWeight:700,
                  cursor:'pointer',
                  boxShadow:'0 4px 16px var(--accent-glow)',
                  transition:'all 0.2s',
                  textAlign:'center'
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.filter = 'brightness(1.1)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.filter = 'none'; }}
              >
                {t("Sauvegarder les modifications")}
              </button>

              {/* Confirmation Toast */}
              {showConfirmation && (
                <div style={{
                  display:'flex',
                  alignItems:'center',
                  justifyContent:'center',
                  gap:'8px',
                  padding:'12px',
                  background:'rgba(16, 185, 129, 0.1)',
                  border:'1px solid var(--green)',
                  borderRadius:'10px',
                  color:'var(--green)',
                  fontSize:'13px',
                  fontWeight:700,
                  animation:'toastFadeIn 0.3s ease-out'
                }}>
                  <CheckCircle size={16} />
                  <span>{t("Paramètres sauvegardés avec succès !")}</span>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      <style>{`
        @keyframes toastFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
