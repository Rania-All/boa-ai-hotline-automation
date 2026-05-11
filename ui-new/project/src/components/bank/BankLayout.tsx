import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, CreditCard, Send, Home, Settings, Bot, Shield } from 'lucide-react';

const BankLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUserStr = localStorage.getItem('boa_bank_current_user');
  const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;

  if (!currentUser) {
    navigate('/bank/login');
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('boa_bank_current_user');
    navigate('/bank/login');
  };

  const navItems = [
    { name: 'Accueil', path: '/bank/dashboard', icon: Home },
    { name: 'Virements', path: '/bank/transfer', icon: Send },
    { name: 'Cartes & Dotations', path: '/bank/cards', icon: CreditCard },
    { name: 'Services', path: '/bank/services', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans text-slate-900">
      {/* Sidebar Premium */}
      <div className="w-72 bg-[#0a192f] text-white shadow-2xl flex flex-col relative overflow-hidden">
        {/* Effet de lumière en arrière-plan de la sidebar */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none" />

        <div className="p-8 border-b border-white/5 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-lg shadow-white/10">
              <img src="/src/assets/boa-logo.png" alt="BOA" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">BOA BANK</h1>
              <p className="text-[10px] text-blue-400 uppercase tracking-[0.2em] font-semibold">Espace Privilège</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-white/5 relative z-10 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-lg font-bold shadow-inner">
              {currentUser.prenom[0]}{currentUser.nom[0]}
            </div>
            <div>
              <p className="text-xs text-blue-200/60">Bienvenue,</p>
              <p className="font-bold text-white leading-tight">{currentUser.prenom} {currentUser.nom}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-1.5 relative z-10 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-4">Menu Principal</p>
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`flex items-center w-full px-5 py-3.5 rounded-xl transition-all duration-300 group ${
                location.pathname === item.path
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 mr-3 transition-transform group-hover:scale-110 ${location.pathname === item.path ? 'text-white' : 'text-gray-500'}`} />
              <span className="font-medium text-sm">{item.name}</span>
            </button>
          ))}

          <div className="pt-8 mt-8 border-t border-white/5">
            <p className="px-4 text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-4">Assistance IA</p>
            <button
              onClick={() => navigate('/')}
              className="flex items-center w-full px-5 py-4 text-blue-400 bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/20 rounded-2xl transition-all duration-300 group shadow-lg shadow-blue-500/5"
            >
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-500/30 transition-colors">
                <Bot className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-bold text-sm leading-none">Chatbot BOA</p>
                <p className="text-[10px] text-blue-300/60 mt-1">Assistant Automatisé</p>
              </div>
            </button>
          </div>
        </nav>

        <div className="p-6 border-t border-white/5 relative z-10 bg-black/10">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-5 py-3 text-gray-400 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all group"
          >
            <LogOut className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
            <span className="text-sm font-medium">Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-[#f8fafc]">
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 h-20 flex items-center justify-between px-10 border-b border-slate-200/60">
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">
              {navItems.find(item => item.path === location.pathname)?.name || 'Espace Client'}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Système Sécurisé Actif</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end mr-4">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Session Id</span>
              <span className="text-xs font-mono text-slate-600">BOA-{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
            </div>
            <div className="h-8 w-[1px] bg-slate-200" />
            <div className="flex items-center gap-3">
              <div className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-3 py-1.5 rounded-full border border-emerald-100 flex items-center gap-1.5">
                <Shield size={12} /> AUTHENTIFIÉ
              </div>
            </div>
          </div>
        </header>
        
        <main className="p-10 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default BankLayout;
