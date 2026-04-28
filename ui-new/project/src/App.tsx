import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Chat from './pages/Chat';
import History from './pages/History';

// Bank Imports
import BankLayout from './components/bank/BankLayout';
import BankLogin from './pages/bank/BankLogin';
import BankRegister from './pages/bank/BankRegister';
import DashboardHome from './pages/bank/DashboardHome';
import TransferPage from './pages/bank/TransferPage';
import CardsPage from './pages/bank/CardsPage';
import ServicesPage from './pages/bank/ServicesPage';

function ChatbotApp() {
  const [currentPage, setCurrentPage] = useState<'chat' | 'history'>('chat');

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'row', 
      width: '100vw', 
      height: '100vh', 
      overflow: 'hidden',
      background: 'var(--bg-deep)' 
    }}>
      {/* Sidebar - Fixe */}
      <div style={{ width: '240px', flexShrink: 0, height: '100%' }}>
        <Sidebar 
          currentPage={currentPage} 
          onNavigate={(page) => setCurrentPage(page)} 
        />
      </div>

      {/* Main Content Area - Forçage du remplissage vertical */}
      <main style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {currentPage === 'chat' ? (
          <Chat />
        ) : (
          <History onBackToChat={() => setCurrentPage('chat')} />
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/*" element={<ChatbotApp />} />
      <Route path="/bank/login" element={<BankLogin />} />
      <Route path="/bank/register" element={<BankRegister />} />
      <Route path="/bank" element={<BankLayout />}>
        <Route path="dashboard" element={<DashboardHome />} />
        <Route path="transfer" element={<TransferPage />} />
        <Route path="cards" element={<CardsPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route index element={<Navigate to="/bank/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
