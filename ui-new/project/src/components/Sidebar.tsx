import { MessageSquare, History, Building, Zap, BarChart3, Shield, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

interface SidebarProps {
  currentPage: 'chat' | 'history' | 'admin' | 'settings';
  onNavigate: (page: 'chat' | 'history' | 'admin' | 'settings') => void;
}

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const navigate = useNavigate();
  const { t } = useSettings();
  const userStr = localStorage.getItem('boa_bank_current_user');
  const user = userStr ? JSON.parse(userStr) : null;
  const role = user?.role || 'guest';

  const [precision, setPrecision] = useState<string>('--');
  const [rpaCount, setRpaCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';
        const res = await fetch(`${BACKEND_URL}/api/admin/stats`);
        if (res.ok) {
          const data = await res.json();
          if (data.avgConfidence != null && data.total > 0) {
            setPrecision(`${(data.avgConfidence * 100).toFixed(0)}%`);
          } else {
            setPrecision('N/A');
          }
          setRpaCount(data.rpaCount ?? 0);
        }
      } catch {
        setPrecision('--');
        setRpaCount(null);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('boa_bank_current_user');
    localStorage.removeItem('chatSessionId');
    window.location.href = '/';
  };

  return (
    <aside className="sidebar">
      {/* Logo zone */}
      <div className="sidebar-logo">
        <div className="logo-mark" style={{ width: '44px', height: '44px', padding: '4px', background: '#fff', borderRadius: '10px' }}>
          <img src="/src/assets/boa-logo.png" alt="BOA Logo" className="w-full h-full object-contain" />
        </div>
        <div className="logo-text">
          <div className="logo-name">Bank Of Africa</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <div className="nav-section-label">{t("Navigation")}</div>

        {(role === 'user' || role === 'guest') && (
          <button
            onClick={() => onNavigate('chat')}
            className={`nav-item ${currentPage === 'chat' ? 'nav-active' : ''}`}
          >
            <MessageSquare size={18} />
            <span>{t("Session en cours")}</span>
            {currentPage === 'chat' && <span className="nav-indicator" />}
          </button>
        )}

        {(role === 'user' || role === 'guest') && (
          <button
            onClick={() => onNavigate('history')}
            className={`nav-item ${currentPage === 'history' ? 'nav-active' : ''}`}
          >
            <History size={18} />
            <span>{t("Historique")}</span>
            {currentPage === 'history' && <span className="nav-indicator" />}
          </button>
        )}

        {role === 'admin' && (
          <button
            onClick={() => onNavigate('admin')}
            className={`nav-item ${currentPage === 'admin' ? 'nav-active' : ''}`}
          >
            <Shield size={18} />
            <span>{t("Dashboard Admin")}</span>
            {currentPage === 'admin' && <span className="nav-indicator" />}
          </button>
        )}

        <button
          onClick={() => onNavigate('settings')}
          className={`nav-item ${currentPage === 'settings' ? 'nav-active' : ''}`}
        >
          <Settings size={18} />
          <span>{t("Paramètres")}</span>
          {currentPage === 'settings' && <span className="nav-indicator" />}
        </button>

        {(role === 'user' || role === 'guest') && (
          <>
            <div className="nav-divider" />
            <div className="nav-section-label">{t("Outils")}</div>
            <button onClick={() => navigate('/bank/login')} className="nav-item">
              <Building size={18} />
              <span>{t("Portail Bancaire")}</span>
            </button>
          </>
        )}

      </nav>

      {/* Metrics card — valeurs dynamiques depuis le backend */}
      <div className="sidebar-metrics">
        <div className="metric-row">
          <div className="metric-item">
            <BarChart3 size={14} color="var(--accent)" />
            <span className="metric-label">{t("Précision")}</span>
            <span className="metric-val">{precision}</span>
          </div>
          <div className="metric-item">
            <Zap size={14} color="var(--green)" />
            <span className="metric-label">{t("Jobs RPA")}</span>
            <span className="metric-val" style={{ color: 'var(--green)' }}>
              {rpaCount !== null ? rpaCount : '--'}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="sidebar-footer" style={{ borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
        <button 
          onClick={handleLogout}
          className="nav-item" 
          style={{ width: '100%', justifyContent: 'flex-start', color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer' }}
        >
          <Zap size={16} />
          <span>{t("Déconnexion")}</span>
        </button>
      </div>
    </aside>
  );
}

