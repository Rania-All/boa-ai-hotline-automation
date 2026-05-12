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
          window.location.href = '/'; // Redirige vers App.tsx qui gère le dashboard admin
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
            window.location.href = '/';
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
          window.location.href = '/';
        }
      }
    } catch (err) {
      setError("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050b18] flex items-center justify-center p-4 font-sans overflow-hidden relative">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative z-10">
        
        {/* Left Side: Visual/Branding */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-blue-600/20 to-transparent border-r border-white/5">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <img src="/src/assets/boa-logo.png" alt="BOA" className="w-8" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">BANK OF AFRICA</span>
            </div>
            <h1 className="text-5xl font-extrabold text-white leading-tight mb-6">
              L'IA au service de votre <span className="text-blue-400">Liberté Financière.</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-md">
              Accédez à votre assistant intelligent pour gérer vos comptes, effectuer des virements RPA et surveiller vos transactions en toute sécurité.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Bot className="text-blue-400" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 lg:p-12 flex flex-col">
          {/* Role Switcher */}
          <div className="flex bg-white/5 p-1 rounded-2xl mb-8 border border-white/5 self-center">
            <button 
              onClick={() => { setActiveTab('client'); setMode('login'); setError(''); }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'client' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-gray-400 hover:text-white'}`}
            >
              <User size={16} /> Accès Client
            </button>
            <button 
              onClick={() => { setActiveTab('admin'); setMode('login'); setError(''); }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'admin' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'text-gray-400 hover:text-white'}`}
            >
              <Shield size={16} /> Superviseur
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                {activeTab === 'admin' ? 'Espace Admin' : (mode === 'login' ? 'Espace Client' : 'Rejoignez-nous')}
              </h2>
              <p className="text-gray-400">
                {activeTab === 'admin' 
                  ? 'Accédez aux outils de surveillance et d\'analyse.' 
                  : (mode === 'login' ? 'Entrez vos identifiants pour continuer.' : 'Créez votre profil client en quelques secondes.')}
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleAction}>
              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm flex items-center gap-2 animate-shake">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              {mode === 'register' && activeTab === 'client' && (
                <div className="space-y-4">
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                    <input 
                      type="text" 
                      placeholder="Nom complet" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
                      value={nom}
                      onChange={e => setNom(e.target.value)}
                      required
                    />
                  </div>
                  <div className="relative group">
                    <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                    <input 
                      type="email" 
                      placeholder="Adresse email" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder={activeTab === 'admin' ? "ID Administrateur" : "Numéro de Compte"} 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
                  value={numeroCompte}
                  onChange={e => setNumeroCompte(e.target.value)}
                  required
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                <input 
                  type="password" 
                  placeholder="Mot de passe" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? 'Traitement...' : (mode === 'login' ? 'Se connecter' : 'Créer un compte')}
                <ArrowRight size={18} />
              </button>
            </form>

            <div className="mt-8 text-center">
              {activeTab === 'client' && (
                <button 
                  onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                  className="text-gray-500 hover:text-white text-sm flex items-center justify-center gap-2 mx-auto transition-colors"
                >
                  {mode === 'login' ? (
                    <> <UserPlus size={16} /> Nouveau client ? Créer un compte </>
                  ) : (
                    <> <ChevronLeft size={16} /> Déjà client ? Se connecter </>
                  )}
                </button>
              )}
              {activeTab === 'admin' && (
                <div className="text-xs text-gray-600 max-w-[200px] mx-auto italic">
                  Les accès administrateur sont restreints au personnel autorisé de Bank Of Africa.
                </div>
              )}
            </div>
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
