<<<<<<< HEAD
import { MessageSquare, History, Zap, TrendingUp, Brain, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
=======
import { MessageSquare, History, Zap } from 'lucide-react';
>>>>>>> 6187067aa60f3fc3c6d1786692066b5b6dfca226
import boaLogo from '../assets/boa-logo.png';

interface SidebarProps {
  currentPage: 'chat' | 'history';
  onNavigate: (page: 'chat' | 'history') => void;
}

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const navigate = useNavigate();

  return (
    <div className="w-64 bg-gradient-to-b from-[#0B3D91] via-[#08306B] to-[#041B3A] text-white h-screen flex flex-col shadow-2xl">
      <div className="p-6 border-b border-white/10 bg-gradient-to-r from-[#0B3D91] to-transparent">
        <div className="flex items-center gap-3 mb-4">
          <img
            src={boaLogo}
            alt="Bank of Africa"
            className="w-12 h-12 rounded-xl bg-white p-1 shadow-lg"
          />
          <div>
            <h1 className="font-bold text-lg leading-tight">Bank of Africa</h1>
            <p className="text-white/80 text-xs">Assistance en ligne</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <div className="flex items-center gap-2 px-4 py-2 text-white/80 text-xs font-semibold uppercase tracking-wider">
          <Zap size={14} />
          <span>Navigation</span>
        </div>

        <button
          onClick={() => onNavigate('chat')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${currentPage === 'chat'
            ? 'bg-white text-[#0B3D91] shadow-lg scale-105'
            : 'text-white/90 hover:bg-white/10'
            }`}
        >
          <MessageSquare size={20} />
          <span className="font-medium">Session en cours</span>
        </button>

        <button
          onClick={() => onNavigate('history')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${currentPage === 'history'
            ? 'bg-white text-[#0B3D91] shadow-lg scale-105'
            : 'text-white/90 hover:bg-white/10'
            }`}
        >
          <History size={20} />
          <span className="font-medium">Historique des échanges</span>
        </button>

        <button
          onClick={() => navigate('/bank/login')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-white/90 hover:bg-white/10 mt-4 border border-white/20`}
        >
          <Building size={20} className="text-[#35B8C6]" />
          <span className="font-medium">Portail Bancaire</span>
        </button>
      </nav>

    </div>
  );
}
