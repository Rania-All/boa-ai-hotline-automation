import { MessageSquare, History, Building, Zap, BarChart3, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  currentPage: 'chat' | 'history' | 'admin';
  onNavigate: (page: 'chat' | 'history' | 'admin') => void;
}

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('boa_bank_current_user');
  const user = userStr ? JSON.parse(userStr) : null;
  const role = user?.role || 'guest';

  const handleLogout = () => {
    localStorage.removeItem('boa_bank_current_user');
    window.location.href = '/login';
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
        <div className="nav-section-label">Navigation</div>

        {(role === 'user' || role === 'guest') && (
          <button
            onClick={() => onNavigate('chat')}
            className={`nav-item ${currentPage === 'chat' ? 'nav-active' : ''}`}
          >
            <MessageSquare size={18} />
            <span>Session en cours</span>
            {currentPage === 'chat' && <span className="nav-indicator" />}
          </button>
        )}

        {(role === 'user' || role === 'guest') && (
          <button
            onClick={() => onNavigate('history')}
            className={`nav-item ${currentPage === 'history' ? 'nav-active' : ''}`}
          >
            <History size={18} />
            <span>Historique</span>
            {currentPage === 'history' && <span className="nav-indicator" />}
          </button>
        )}

        {role === 'admin' && (
          <button
            onClick={() => onNavigate('admin')}
            className={`nav-item ${currentPage === 'admin' ? 'nav-active' : ''}`}
          >
            <Shield size={18} />
            <span>Dashboard Admin</span>
            {currentPage === 'admin' && <span className="nav-indicator" />}
          </button>
        )}

        <div className="nav-divider" />
        <div className="nav-section-label">Outils</div>

        <button onClick={() => navigate('/bank/login')} className="nav-item nav-portal">
          <Building size={18} />
          <span>Portail Bancaire</span>
        </button>
      </nav>

      {/* Metrics card */}
      <div className="sidebar-metrics">
        <div className="metric-row">
          <div className="metric-item">
            <BarChart3 size={14} color="var(--accent)" />
            <span className="metric-label">Précision</span>
            <span className="metric-val">87%</span>
          </div>
          <div className="metric-item">
            <Zap size={14} color="#10b981" />
            <span className="metric-label">RPA actif</span>
            <span className="metric-val" style={{ color: '#10b981' }}>ON</span>
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
          <span>Déconnexion</span>
        </button>
        <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', fontSize: '10px' }}>
          <Shield size={12} />
          <span>Données chiffrées · BOA</span>
        </div>
      </div>
    </aside>
  );
}
