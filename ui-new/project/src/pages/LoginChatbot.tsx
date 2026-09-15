import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  User, 
  Lock, 
  ArrowRight, 
  Bot, 
  UserPlus, 
  ChevronLeft,
  Sparkles
} from 'lucide-react';
import { BankStorage } from '../utils/BankStorage';

type Tab = 'client' | 'admin';
type Mode = 'login' | 'register';

export default function LoginChatbot() {
  const [activeTab, setActiveTab] = useState<Tab>('client');
  const [mode, setMode] = useState<Mode>('login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  React.useEffect(() => {
    // Si l'utilisateur est déjà connecté, on le redirige vers le chat
    if (localStorage.getItem('boa_bank_current_user')) {
      window.location.href = '/chat';
    }
  }, []);

  // Form states
  const [numeroCompte, setNumeroCompte] = useState('');
  const [password, setPassword] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');

  const navigate = useNavigate();

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));

    try {
      if (activeTab === 'admin') {
        const trimmedCompte = numeroCompte.trim();
        const trimmedPassword = password.trim();
        const users = BankStorage.getUsers();
        const admin = users.find(u => u.numeroCompte === trimmedCompte && u.role === 'admin');
        
        if (admin && admin.motDePasse === trimmedPassword) {
          localStorage.setItem('boa_bank_current_user', JSON.stringify(admin));
          localStorage.removeItem('chatSessionId');
          window.location.href = '/chat'; // Redirige vers App.tsx qui gère le dashboard admin
        } else {
          setError("Identifiants administrateur incorrects.");
        }
      } else {
        if (mode === 'login') {
          const trimmedCompte = numeroCompte.trim();
          const trimmedPassword = password.trim();
          const user = BankStorage.getUserByCompte(trimmedCompte);
          
          if (user && user.motDePasse === trimmedPassword && user.role === 'user') {
            localStorage.setItem('boa_bank_current_user', JSON.stringify(user));
            localStorage.removeItem('chatSessionId');
            window.location.href = '/chat';
          } else {
            setError("Numéro de compte ou mot de passe incorrect.");
          }
        } else {
          // Register logic
          const newUser = BankStorage.register({
            nom,
            prenom: '',
            telephone: '',
            genre: 'M',
            cin: 'REG-' + Math.floor(Math.random() * 1000),
            nationalite: 'Marocaine',
            email,
            dateNaissance: '2000-01-01',
            motDePasse: password
          });
          localStorage.setItem('boa_bank_current_user', JSON.stringify(newUser));
          localStorage.removeItem('chatSessionId');
          window.location.href = '/chat';
        }
      }
    } catch (err) {
      setError("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center p-3 font-sans overflow-hidden relative" style={{background: 'linear-gradient(135deg, #00b5c8 0%, #009bae 40%, #007a8c 70%, #002f6c 100%)'}}>
      {/* Background hexagon decorations like BOA mobile app */}
      <div className="absolute top-[-5%] left-[-5%] w-[35%] h-[35%] opacity-20" style={{background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)'}}>
        <svg viewBox="0 0 200 200" className="w-full h-full opacity-30"><polygon points="100,10 190,55 190,145 100,190 10,145 10,55" fill="none" stroke="white" strokeWidth="2"/></svg>
      </div>
      <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] opacity-15" style={{background: 'radial-gradient(circle, #002f6c 0%, transparent 70%)'}}>
        <svg viewBox="0 0 200 200" className="w-full h-full opacity-20"><polygon points="100,10 190,55 190,145 100,190 10,145 10,55" fill="none" stroke="#002f6c" strokeWidth="3"/></svg>
      </div>
      <div className="absolute top-[30%] right-[5%] w-[20%] h-[20%] opacity-10">
        <svg viewBox="0 0 200 200" className="w-full h-full"><polygon points="100,10 190,55 190,145 100,190 10,145 10,55" fill="none" stroke="white" strokeWidth="2"/></svg>
      </div>

      <div style={{
        width:'100%', maxWidth:'1000px', minHeight:'500px',
        display:'grid', gridTemplateColumns:'1fr 1fr',
        borderRadius:'16px', overflow:'hidden',
        background:'rgba(0,47,108,0.25)',
        backdropFilter:'blur(20px)',
        border:'1px solid rgba(255,255,255,0.2)',
        boxShadow:'0 20px 60px rgba(0,0,0,0.4)',
        position:'relative', zIndex:10
      }}>
        
        {/* Left Side */}
        <div style={{
          display:'flex', flexDirection:'column', justifyContent:'center',
          padding:'40px',
          background:'rgba(0,181,200,0.15)',
          borderRight:'1px solid rgba(255,255,255,0.15)'
        }}>
          <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'16px'}}>
            <div style={{width:'40px',height:'40px',background:'white',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 2px 8px rgba(0,0,0,0.2)'}}>
              <img src="/src/assets/boa-logo.png" alt="BOA" style={{width:'28px'}} />
            </div>
            <div>
              <div style={{fontSize:'16px',fontWeight:800,color:'white',letterSpacing:'0.5px',lineHeight:1}}>BANK OF AFRICA</div>
              <div style={{fontSize:'10px',color:'rgba(255,255,255,0.6)',letterSpacing:'2px',fontWeight:600,marginTop:'4px'}}>BMCE GROUP</div>
            </div>
          </div>
          <h1 style={{fontSize:'28px',fontWeight:900,color:'white',lineHeight:1.2,marginBottom:'16px'}}>
            L'IA au service de votre{' '}
            <span style={{color:'#002f6c',textShadow:'0 2px 12px rgba(0,47,108,0.5)'}}>Liberté Financière.</span>
          </h1>
          <p style={{fontSize:'14px',color:'rgba(255,255,255,0.85)',lineHeight:1.6}}>
            Accédez à votre assistant intelligent pour gérer vos comptes, effectuer des virements RPA et surveiller vos transactions en toute sécurité.
          </p>
        </div>

        {/* Right Side: Form */}
        <div style={{padding:'40px',display:'flex',flexDirection:'column',background:'rgba(0,181,200,0.08)'}}>
          
          {/* Role Switcher */}
          <div style={{display:'flex',background:'rgba(255,255,255,0.1)',borderRadius:'12px',padding:'4px',marginBottom:'24px',alignSelf:'center',border:'1px solid rgba(255,255,255,0.2)'}}>
            <button 
              onClick={() => { setActiveTab('client'); setMode('login'); setError(''); }}
              style={{
                display:'flex',alignItems:'center',gap:'8px',
                padding:'8px 18px',borderRadius:'8px',fontSize:'14px',fontWeight:600,
                background: activeTab==='client' ? 'rgba(255,255,255,0.2)' : 'transparent',
                color: activeTab==='client' ? 'white' : 'rgba(255,255,255,0.55)',
                border:'none',cursor:'pointer',transition:'all 0.2s'
              }}
            >
              <User size={15} /> Accès Client
            </button>
            <button 
              onClick={() => { setActiveTab('admin'); setMode('login'); setError(''); }}
              style={{
                display:'flex',alignItems:'center',gap:'8px',
                padding:'8px 18px',borderRadius:'8px',fontSize:'14px',fontWeight:600,
                background: activeTab==='admin' ? '#002f6c' : 'transparent',
                color: activeTab==='admin' ? 'white' : 'rgba(255,255,255,0.55)',
                border:'none',cursor:'pointer',transition:'all 0.2s',
                boxShadow: activeTab==='admin' ? '0 4px 12px rgba(0,47,108,0.5)' : 'none'
              }}
            >
              <Shield size={15} /> Superviseur
            </button>
          </div>

          {/* Form title */}
          <div style={{marginBottom:'20px'}}>
            <h2 style={{fontSize:'20px',fontWeight:700,color:'white',marginBottom:'6px'}}>
              {activeTab === 'admin' ? 'Espace Admin' : (mode === 'login' ? 'Espace Client' : 'Rejoignez-nous')}
            </h2>
            <p style={{fontSize:'13px',color:'rgba(255,255,255,0.7)'}}>
              {activeTab === 'admin'
                ? "Accédez aux outils de surveillance et d'analyse."
                : (mode === 'login' ? 'Entrez vos identifiants pour continuer.' : 'Créez votre profil client en quelques secondes.')}
            </p>
          </div>

          <form onSubmit={handleAction} style={{display:'flex',flexDirection:'column',gap:'14px'}}>
            {error && (
              <div style={{padding:'10px 14px',borderRadius:'8px',color:'#fecaca',fontSize:'13px',display:'flex',alignItems:'center',gap:'8px',background:'rgba(239,68,68,0.2)',border:'1px solid rgba(239,68,68,0.4)'}}>
                <AlertCircle size={16} /> {error}
              </div>
            )}

            {mode === 'register' && activeTab === 'client' && (
              <>
                <div style={{position:'relative'}}>
                  <User style={{position:'absolute',left:'14px',top:'50%',transform:'translateY(-50%)',color:'rgba(255,255,255,0.45)'}} size={16} />
                  <input type="text" placeholder="Nom complet"
                    style={{width:'100%',boxSizing:'border-box',background:'rgba(255,255,255,0.12)',border:'1px solid rgba(255,255,255,0.2)',borderRadius:'10px',padding:'12px 14px 12px 38px',color:'white',fontSize:'14px',outline:'none'}}
                    value={nom} onChange={e => setNom(e.target.value)} required
                  />
                </div>
                <div style={{position:'relative'}}>
                  <Sparkles style={{position:'absolute',left:'14px',top:'50%',transform:'translateY(-50%)',color:'rgba(255,255,255,0.45)'}} size={16} />
                  <input type="email" placeholder="Adresse email"
                    style={{width:'100%',boxSizing:'border-box',background:'rgba(255,255,255,0.12)',border:'1px solid rgba(255,255,255,0.2)',borderRadius:'10px',padding:'12px 14px 12px 38px',color:'white',fontSize:'14px',outline:'none'}}
                    value={email} onChange={e => setEmail(e.target.value)} required
                  />
                </div>
              </>
            )}

            <div style={{position:'relative'}}>
              <User style={{position:'absolute',left:'14px',top:'50%',transform:'translateY(-50%)',color:'rgba(255,255,255,0.45)'}} size={16} />
              <input type="text" placeholder={activeTab === 'admin' ? 'ID Administrateur' : 'Numéro de Compte'}
                style={{width:'100%',boxSizing:'border-box',background:'rgba(255,255,255,0.12)',border:'1px solid rgba(255,255,255,0.2)',borderRadius:'10px',padding:'12px 14px 12px 38px',color:'white',fontSize:'14px',outline:'none'}}
                value={numeroCompte} onChange={e => setNumeroCompte(e.target.value)} required
              />
            </div>

            <div style={{position:'relative'}}>
              <Lock style={{position:'absolute',left:'14px',top:'50%',transform:'translateY(-50%)',color:'rgba(255,255,255,0.45)'}} size={16} />
              <input type="password" placeholder="Mot de passe"
                style={{width:'100%',boxSizing:'border-box',background:'rgba(255,255,255,0.12)',border:'1px solid rgba(255,255,255,0.2)',borderRadius:'10px',padding:'12px 14px 12px 38px',color:'white',fontSize:'14px',outline:'none'}}
                value={password} onChange={e => setPassword(e.target.value)} required
              />
            </div>

            <button type="submit" disabled={loading} style={{
              width:'100%',background:'#002f6c',color:'white',
              border:'none',borderRadius:'10px',padding:'14px',marginTop:'4px',
              fontSize:'15px',fontWeight:700,cursor:'pointer',
              display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',
              boxShadow:'0 4px 16px rgba(0,47,108,0.5)',
              opacity: loading ? 0.7 : 1, transition:'all 0.2s'
            }}>
              {loading ? 'Traitement...' : (mode === 'login' ? 'Se connecter' : 'Créer un compte')}
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Bottom link */}
          <div style={{marginTop:'20px',textAlign:'center'}}>
            {activeTab === 'client' && (
              <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                style={{background:'none',border:'none',color:'rgba(255,255,255,0.55)',fontSize:'13px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'6px',margin:'0 auto'}}
              >
                {mode === 'login'
                  ? <><UserPlus size={15} /> Nouveau client ? Créer un compte</>
                  : <><ChevronLeft size={15} /> Déjà client ? Se connecter</>
                }
              </button>
            )}
            {activeTab === 'admin' && (
              <div style={{fontSize:'12px',color:'rgba(255,255,255,0.35)',fontStyle:'italic',maxWidth:'260px',margin:'0 auto'}}>
                Les accès administrateur sont restreints au personnel autorisé de Bank Of Africa.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AlertCircle(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
