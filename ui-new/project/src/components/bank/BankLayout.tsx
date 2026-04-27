import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, CreditCard, Send, Home, Settings } from 'lucide-react';

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
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white shadow-xl flex flex-col">
        <div className="p-6 border-b border-blue-800">
          <h1 className="text-2xl font-bold">BANK OF AFRICA</h1>
          <p className="text-sm text-blue-300 mt-1">Espace Client</p>
        </div>
        
        <div className="p-4">
          <p className="text-sm text-blue-200">Bienvenue,</p>
          <p className="font-semibold">{currentUser.prenom} {currentUser.nom}</p>
          <p className="text-xs text-blue-300 mt-1">Compte: {currentUser.numeroCompte}</p>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-blue-800 text-white'
                  : 'text-blue-200 hover:bg-blue-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-blue-800">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-blue-200 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Déconnexion
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-8">
          <h2 className="text-xl font-semibold text-gray-800">
            {navItems.find(item => item.path === location.pathname)?.name || 'Espace Client'}
          </h2>
          <div className="flex items-center space-x-4">
             <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded border border-green-400">Connecté</span>
          </div>
        </header>
        
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default BankLayout;
