import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BankStorage } from '../../utils/BankStorage';
import { Shield, UserPlus, ArrowLeft, User, Phone, Mail, FileText, Calendar, Lock, Globe, CheckCircle } from 'lucide-react';

const BankRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    genre: 'M',
    cin: '',
    nationalite: 'Marocaine',
    email: '',
    dateNaissance: '',
    motDePasse: ''
  });

  const [registeredUser, setRegisteredUser] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = BankStorage.register(formData as any);
    setRegisteredUser(newUser);
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
      <main className="relative z-10 w-full flex-1 flex items-center justify-center px-4 py-4">
        <div className="w-full max-w-2xl flex flex-col items-center">
          
          {registeredUser ? (
            /* REGISTRATION SUCCESS VIEW */
            <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200/50 text-center text-slate-800 animate-fade-in">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-2xl bg-green-500/20 border border-green-500/30 mb-4">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-[#002f6c] mb-1">Compte Créé !</h2>
              <p className="text-slate-500 mb-4 text-xs px-2">Veuillez conserver précieusement vos identifiants de connexion :</p>
              
              {/* Virtual Card */}
              <div className="w-full bg-gradient-to-br from-blue-700 to-indigo-900 p-5 rounded-xl mb-6 border border-white/10 shadow-xl relative overflow-hidden text-left text-white">
                <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-white/5 rounded-full blur-2xl" />
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-blue-200 font-bold">BANK OF AFRICA</p>
                    <p className="text-[10px] text-blue-300 font-medium">Digital Banking</p>
                  </div>
                  <div className="w-9 h-6 bg-white/10 rounded-md backdrop-blur-sm border border-white/10 flex items-center justify-center">
                    <Shield className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>

                <div className="mb-5">
                  <p className="text-[9px] uppercase tracking-widest text-blue-200/70 mb-1">Numéro de Compte</p>
                  <p className="text-lg font-mono font-bold text-white tracking-wider bg-black/20 px-3.5 py-1 rounded-lg inline-block">{registeredUser.numeroCompte}</p>
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[8px] uppercase tracking-widest text-blue-200/70">Titulaire</p>
                    <p className="text-xs font-semibold text-white mt-0.5">{formData.prenom} {formData.nom}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] uppercase tracking-widest text-blue-200/70">Solde Initial</p>
                    <p className="text-sm font-bold text-green-400 mt-0.5">{registeredUser.solde} MAD</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/bank/login')}
                className="w-full bg-[#002f6c] text-white py-3 rounded-full text-xs font-bold tracking-wider hover:bg-[#00204a] active:scale-[0.98] transition-all"
              >
                Aller à la page de connexion
              </button>
            </div>
          ) : (
            /* REGISTRATION FORM VIEW */
            <div className="w-full flex flex-col">
              
              {/* Header Back Button */}
              <div className="flex items-center justify-between mb-3">
                <button 
                  onClick={() => navigate('/bank/login')}
                  className="flex items-center gap-1.5 text-white/95 hover:text-white transition-colors text-[10px] font-bold bg-white/10 border border-white/10 px-3 py-1 rounded-full"
                >
                  <ArrowLeft className="w-3 h-3" /> Retour au portail
                </button>
                <div className="flex items-center space-x-1.5 text-blue-300 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
                  <UserPlus className="w-3 h-3" />
                  <span className="text-[10px] font-bold tracking-wide">Inscription Nouveau Client</span>
                </div>
              </div>

              {/* Form Card */}
              <div className="bg-white rounded-2xl p-5 shadow-2xl border border-slate-200/50 text-slate-800">
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Nom</label>
                      <div className="relative group">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input type="text" name="nom" required placeholder="Votre nom" value={formData.nom} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs font-semibold focus:outline-none focus:border-blue-400 focus:bg-white transition-all text-slate-800" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Prénom</label>
                      <div className="relative group">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input type="text" name="prenom" required placeholder="Votre prénom" value={formData.prenom} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs font-semibold focus:outline-none focus:border-blue-400 focus:bg-white transition-all text-slate-800" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Genre</label>
                      <div className="relative">
                        <select name="genre" value={formData.genre} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:border-blue-400 focus:bg-white transition-all text-slate-850 appearance-none cursor-pointer">
                          <option value="M">Masculin</option>
                          <option value="F">Féminin</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                          <svg className="fill-current h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Date de Naissance</label>
                      <div className="relative group">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input type="date" name="dateNaissance" required value={formData.dateNaissance} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 pl-9 pr-3 text-xs font-semibold focus:outline-none focus:border-blue-400 focus:bg-white transition-all text-slate-850 cursor-pointer" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">CIN / Passeport</label>
                      <div className="relative group">
                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input type="text" name="cin" required placeholder="Ex: AB123456" value={formData.cin} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs font-semibold focus:outline-none focus:border-blue-400 focus:bg-white transition-all text-slate-800" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Nationalité</label>
                      <div className="relative group">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input type="text" name="nationalite" required placeholder="Marocaine" value={formData.nationalite} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs font-semibold focus:outline-none focus:border-blue-400 focus:bg-white transition-all text-slate-800" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">N° Téléphone</label>
                      <div className="relative group">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input type="tel" name="telephone" required placeholder="0612345678" value={formData.telephone} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs font-semibold focus:outline-none focus:border-blue-400 focus:bg-white transition-all text-slate-800" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Email</label>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input type="email" name="email" required placeholder="nom@exemple.com" value={formData.email} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs font-semibold focus:outline-none focus:border-blue-400 focus:bg-white transition-all text-slate-800" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-slate-100">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Mot de passe accès web</label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      <input type="password" name="motDePasse" required placeholder="••••••••" value={formData.motDePasse} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs font-semibold focus:outline-none focus:border-blue-400 focus:bg-white transition-all text-slate-800" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#002f6c] text-white py-3 rounded-xl text-xs font-bold tracking-wider hover:bg-[#00204a] active:scale-[0.98] transition-all shadow-md flex items-center justify-center"
                  >
                    Générer mon compte bancaire
                  </button>
                </form>
              </div>
            </div>
          )}
          
        </div>
      </main>

      {/* Footer / Copyright bar */}
      <footer className="relative z-10 w-full py-2 text-center text-[10px] text-white/40 tracking-wider">
        © 2026 BANK OF AFRICA - BMCE GROUP. TOUS DROITS RÉSERVÉS.
      </footer>

    </div>
  );
};
export default BankRegister;
