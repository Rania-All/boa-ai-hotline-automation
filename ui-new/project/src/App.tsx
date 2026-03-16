import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Chat from './pages/Chat';
import History from './pages/History';

function App() {
  const [currentPage, setCurrentPage] = useState<'chat' | 'history'>('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 transform transition-transform lg:transform-none ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <Sidebar currentPage={currentPage} onNavigate={(page) => {
          setCurrentPage(page);
          setIsSidebarOpen(false);
        }} />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-red-600 text-white rounded-lg shadow-lg"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {currentPage === 'chat' ? (
          <Chat />
        ) : (
          <History onBackToChat={() => setCurrentPage('chat')} />
        )}
      </div>
    </div>
  );
}

export default App;
