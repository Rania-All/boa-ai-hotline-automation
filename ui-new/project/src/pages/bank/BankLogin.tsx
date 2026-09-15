import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BankStorage } from '../../utils/BankStorage';
import { Shield, AlertTriangle, User, Lock, ArrowRight, UserPlus, Globe, Eye, EyeOff } from 'lucide-react';

const BankLogin = () => {
  const [numeroCompte, setNumeroCompte] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const navigate = useNavigate();

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLocked) {
      setError("Compte bloqué. Veuillez vérifier votre boîte mail.");
      return;
    }

    const user = BankStorage.getUserByCompte(numeroCompte);

    if (user && user.motDePasse === password) {
      localStorage.setItem('boa_bank_current_user', JSON.stringify(user));
      localStorage.removeItem('chatSessionId');
      
      navigate('/bank/dashboard');
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 3) {
        setIsLocked(true);
        setToastMessage("📧 EMAIL ENVOYÉ : Réinitialisation du mot de passe envoyée.");
        setTimeout(() => setToastMessage(''), 8000);
      } else {
        setError(`Identifiants incorrects. Tentatives restantes : ${3 - newAttempts}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#002f6c] flex flex-col justify-between relative font-sans overflow-hidden select-none">
      
      {/* SVG Waves Background covering full screen */}
      <div className="absolute inset-0 z-0">
        <svg className="w-full h-full object-cover" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <rect width="1440" height="900" fill="#002f6c"/>
          <path d="M1440 0H0V450C250 550 500 580 720 530C980 470 1200 520 1440 600V0Z" fill="url(#paint0_linear)"/>
          <path opacity="0.8" d="M1440 0H0V400C300 480 600 440 850 480C1100 520 1300 460 1440 420V0Z" fill="#00a3b6"/>
          <path opacity="0.3" d="M1440 0H0V320C200 400 450 350 720 380C990 410 1250 350 1440 320V0Z" fill="#00b2c6"/>
          <defs>
            <linearGradient id="paint0_linear" x1="720" y1="0" x2="720" y2="600" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00b2c6"/>
              <stop offset="0.6" stopColor="#00a3b6"/>
              <stop offset="1" stopColor="#0091a1"/>
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 max-w-sm bg-blue-600/95 backdrop-blur border border-blue-400/30 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-start space-x-3 z-50 animate-bounce">
          <Shield className="w-6 h-6 flex-shrink-0 text-blue-300" />
          <p className="text-sm font-medium">{toastMessage}</p>
        </div>
      )}

      {/* Web Header */}
      <header className="relative z-10 w-full px-6 py-6 max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 shadow-sm">
          <div className="text-right">
            <p className="text-sm font-black tracking-widest text-[#002f6c] leading-none">BANK OF AFRICA</p>
            <p className="text-[9px] font-extrabold tracking-widest text-[#002f6c]/70 mt-1 leading-none">BMCE GROUP</p>
          </div>
          <div className="w-8 h-8 bg-[#002f6c] rounded-full flex items-center justify-center shadow-md border border-white/10">
            <svg className="w-5 h-5 text-white" viewBox="0 0 100 100" fill="currentColor">
              <circle cx="50" cy="50" r="45" stroke="white" strokeWidth="6" fill="none"/>
              <path d="M42 32C44 30 46 29 49 29C52 29 55 30 57 32C59 34 60 37 59 40C58 43 62 46 63 48C64 51 61 53 59 56C58 58 57 62 54 64C52 67 50 70 47 72C46 73 45 70 44 68C43 66 42 65 41 64C40 62 41 60 40 59C39 57 38 56 37 54C36 53 37 51 36 49C35 47 34 46 34 44C34 42 36 41 37 40C38 38 37 36 38 35C39 33 40 33 42 32Z" fill="white"/>
            </svg>
          </div>
        </div>

        {/* Language switcher */}
        <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-white cursor-pointer hover:bg-white/25 border border-white/10 transition-all">
          <Globe size={14} className="text-white/90" />
          <span>FR</span>
          <span className="text-[9px] opacity-85">▼</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 w-full flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[420px] flex flex-col items-center">
          
          {/* PASSWORD CREDENTIAL VIEW */}
          <div className="w-full bg-white rounded-[32px] p-6 shadow-2xl border border-slate-200/50 text-slate-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-extrabold text-[#002f6c] uppercase tracking-wide">Accès sécurisé web</h3>
            </div>

            <form onSubmit={handlePasswordLogin} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertTriangle size={16} className="flex-shrink-0" />
                  <span className="font-semibold">{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Numéro de Compte</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    required
                    placeholder="Ex: 0111175501"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm font-semibold focus:outline-none focus:border-blue-400 focus:bg-white transition-all text-slate-800"
                    value={numeroCompte}
                    onChange={e => setNumeroCompte(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-12 text-sm font-semibold focus:outline-none focus:border-blue-400 focus:bg-white transition-all text-slate-800"
                    style={{WebkitAppearance: 'none'}}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-[#002f6c] text-white py-3.5 rounded-xl text-sm font-bold tracking-wider hover:bg-[#00204a] active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Valider les identifiants</span>
                <ArrowRight size={16} />
              </button>
            </form>
          </div>

          {/* Bottom Navigation Buttons */}
          <div className="mt-8 w-full">
            <button 
              onClick={() => navigate('/bank/register')}
              className="w-full bg-[#002f6c]/40 text-white/80 py-3.5 rounded-full text-xs font-semibold hover:bg-[#002f6c]/60 active:scale-[0.98] transition-all border border-white/5 flex items-center justify-center gap-2"
            >
              <UserPlus size={14} className="text-blue-300" />
              <span>Plus d'options / Créer un compte</span>
            </button>
          </div>

        </div>
      </main>

      {/* Footer / Copyright bar */}
      <footer className="relative z-10 w-full py-4 text-center text-[10px] text-white/40 tracking-wider">
        © 2026 BANK OF AFRICA - BMCE GROUP. TOUS DROITS RÉSERVÉS.
      </footer>

    </div>
  );
};

export default BankLogin;
