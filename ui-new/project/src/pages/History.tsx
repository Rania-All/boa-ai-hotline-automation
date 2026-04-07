import { useState, useEffect } from 'react';
import { RefreshCw, Trash2, ArrowLeft } from 'lucide-react';
import { clearHistory, getHistory } from '../services/api';
import SentimentIndicator from '../components/SentimentIndicator';
import type { Conversation } from '../types';

export default function History({ onBackToChat }: { onBackToChat: () => void }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const history = await getHistory();
      setConversations(history);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredConversations = conversations.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const handleClear = async () => {
    if (conversations.length === 0) return;
    const ok = window.confirm('Vider tout l’historique ?');
    if (!ok) return;
    try {
      await clearHistory();
      setConversations([]);
    } catch (e) {
      console.error('Failed to clear history:', e);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Historique des conversations</h2>
            <p className="text-sm text-gray-600 mt-1">
              {filteredConversations.length} enregistrement{filteredConversations.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToChat}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              title="Retour au chat"
            >
              <ArrowLeft size={16} />
              <span>Chat</span>
            </button>
            <button
              onClick={handleClear}
              disabled={conversations.length === 0 || isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-white text-rose-700 rounded-lg border border-rose-300 hover:bg-rose-50 disabled:opacity-60 transition-colors"
              title="Vider l’historique"
            >
              <Trash2 size={16} />
              <span>Vider</span>
            </button>
            <button
              onClick={loadHistory}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-[#0B3D91] text-white rounded-lg hover:bg-[#08306B] disabled:bg-gray-300 transition-colors"
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              <span>Actualiser</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0B3D91] border-t-transparent" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucune conversation enregistrée</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Date / Heure
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Question
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Réponse
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Sentiment
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredConversations.map((conv, index) => (
                    <tr key={conv.id} className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                        {formatDate(conv.created_at)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                        <div className="line-clamp-2">{conv.question}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-md">
                        <div className="line-clamp-3">{conv.answer}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <SentimentIndicator text={conv.answer} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
