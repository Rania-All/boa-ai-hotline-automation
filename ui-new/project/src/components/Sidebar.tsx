import { MessageSquare, History, Zap, TrendingUp, Brain } from 'lucide-react';
import boaLogo from '../assets/boa-logo.png';

interface SidebarProps {
  currentPage: 'chat' | 'history';
  onNavigate: (page: 'chat' | 'history') => void;
}

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
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
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
            currentPage === 'chat'
              ? 'bg-white text-[#0B3D91] shadow-lg scale-105'
              : 'text-white/90 hover:bg-white/10'
          }`}
        >
          <MessageSquare size={20} />
          <span className="font-medium">Session en cours</span>
        </button>

        <button
          onClick={() => onNavigate('history')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
            currentPage === 'history'
              ? 'bg-white text-[#0B3D91] shadow-lg scale-105'
              : 'text-white/90 hover:bg-white/10'
          }`}
        >
          <History size={20} />
          <span className="font-medium">Historique des échanges</span>
        </button>
      </nav>

      <div className="p-4 space-y-3 border-t border-white/10">
        <div className="bg-gradient-to-r from-white/10 to-[#35B8C6]/20 rounded-lg p-4 backdrop-blur-sm border border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <Brain size={16} className="text-[#35B8C6]" />
            <p className="text-xs font-bold text-white/90">TECHNOLOGIE IA</p>
          </div>
          <p className="text-xs text-white/80 leading-relaxed mb-2">
            NLP avancé + Recherche FAQ intelligente
          </p>
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className="text-[#35B8C6]" />
            <span className="text-xs text-white/90 font-semibold">Historique & suivi</span>
          </div>
        </div>
      </div>
    </div>
  );
}
