import { useState, useEffect } from 'react';
import { RefreshCw, Trash2, ArrowLeft, MessageCircle, Clock, TrendingUp } from 'lucide-react';
import { clearHistory, getHistory } from '../services/api';
import type { Conversation } from '../types';

export default function History({ onBackToChat }: { onBackToChat: () => void }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => { loadHistory(); }, []);

  const loadHistory = async () => {
    setIsLoading(true);
    try { setConversations(await getHistory()); }
    catch { /* silent */ }
    finally { setIsLoading(false); }
  };

  const handleClear = async () => {
    if (!conversations.length || !confirm("Vider tout l'historique ?")) return;
    await clearHistory();
    setConversations([]);
  };

  const fmt = (d: string) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  const conf = (c: number) => c >= 0.8 ? '#10b981' : c >= 0.5 ? '#f59e0b' : '#ef4444';
  const confLabel = (c: number) => c >= 0.8 ? 'Élevée' : c >= 0.5 ? 'Moyenne' : 'Faible';

  const sorted = [...conversations].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  const avgConf = conversations.length ? conversations.reduce((s, c) => s + c.confidence, 0) / conversations.length : 0;

  return (
    <div className="history-page">
      {/* Header */}
      <header className="history-header">
        <div className="history-title-row">
          <button className="btn-back" onClick={onBackToChat}>
            <ArrowLeft size={16} /> Retour
          </button>
          <h1 className="history-title">Historique</h1>
        </div>

        {/* Stats row */}
        <div className="history-stats">
          <div className="hstat">
            <MessageCircle size={18} color="var(--accent)" />
            <div>
              <div className="hstat-val">{conversations.length}</div>
              <div className="hstat-label">Messages</div>
            </div>
          </div>
          <div className="hstat">
            <TrendingUp size={18} color="#10b981" />
            <div>
              <div className="hstat-val" style={{ color: '#10b981' }}>{(avgConf * 100).toFixed(0)}%</div>
              <div className="hstat-label">Confiance</div>
            </div>
          </div>
          <div className="hstat">
            <Clock size={18} color="#8b5cf6" />
            <div>
              <div className="hstat-val" style={{ color: '#8b5cf6' }}>
                {conversations.length ? fmt(sorted[0]?.created_at) : '—'}
              </div>
              <div className="hstat-label">Dernier</div>
            </div>
          </div>
        </div>

        <div className="history-actions">
          <button className="btn-refresh" onClick={loadHistory} disabled={isLoading}>
            <RefreshCw size={15} className={isLoading ? 'spin' : ''} /> Actualiser
          </button>
          <button className="btn-clear" onClick={handleClear} disabled={!conversations.length}>
            <Trash2 size={15} /> Vider
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="history-content">
        {isLoading ? (
          <div className="history-loading">
            <div className="spinner-lg" />
            <span>Chargement…</span>
          </div>
        ) : sorted.length === 0 ? (
          <div className="history-empty">
            <MessageCircle size={48} strokeWidth={1} />
            <p>Aucune conversation enregistrée</p>
          </div>
        ) : (
          <div className="conv-list">
            {sorted.map((conv) => (
              <div
                key={conv.id}
                className={`conv-card ${selected === conv.id ? 'conv-expanded' : ''}`}
                onClick={() => setSelected(selected === conv.id ? null : conv.id)}
              >
                <div className="conv-card-header">
                  <div className="conv-question">{conv.question}</div>
                  <div className="conv-meta">
                    <span className="conv-conf" style={{ color: conf(conv.confidence), borderColor: conf(conv.confidence) + '33', background: conf(conv.confidence) + '11' }}>
                      {confLabel(conv.confidence)} · {(conv.confidence * 100).toFixed(0)}%
                    </span>
                    <span className="conv-time">{fmt(conv.created_at)}</span>
                  </div>
                </div>
                {selected === conv.id && (
                  <div className="conv-answer">
                    <div className="conv-answer-label">Réponse de l'assistant</div>
                    <p>{conv.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
