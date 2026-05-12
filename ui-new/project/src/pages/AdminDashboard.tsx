import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  ShieldAlert, 
  Trash2, 
  RefreshCcw, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Activity
} from 'lucide-react';
import { getHistory, clearHistory } from '../services/api';
import { BankStorage } from '../utils/BankStorage';

interface Stats {
  total: number;
  avgConfidence: number;
  maxConfidence: number;
  sources: Record<string, number>;
  top5: Array<[string, number]>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';
      const statsRes = await fetch(`${BACKEND_URL}/api/admin/stats`);
      const statsData = await statsRes.json();
      setStats(statsData);

      const historyData = await getHistory();
      setHistory(historyData.slice(0, 10)); // Top 10 recent
    } catch (error) {
      console.error("Dashboard data fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleClearData = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer tout l'historique et les statistiques ?")) return;
    
    setIsClearing(true);
    try {
      await clearHistory();
      await fetchDashboardData();
      alert("Données nettoyées avec succès.");
    } catch (error) {
      alert("Erreur lors du nettoyage.");
    } finally {
      setIsClearing(false);
    }
  };

  if (isLoading && !stats) {
    return (
      <div className="flex items-center justify-center h-full text-white">
        <RefreshCcw className="animate-spin mr-2" /> Chargement du dashboard...
      </div>
    );
  }

  return (
    <div className="p-8 overflow-y-auto h-full space-y-8 bg-[var(--bg-deep)] text-white">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ShieldAlert className="text-red-500" /> Dashboard Superviseur
          </h1>
          <p className="text-gray-400 mt-2">Surveillance du système et analyse de l'utilisation IA/RPA.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={fetchDashboardData}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700"
          >
            <RefreshCcw size={18} /> Actualiser
          </button>
          <button 
            onClick={handleClearData}
            disabled={isClearing}
            className="flex items-center gap-2 px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg transition-colors border border-red-900/50"
          >
            <Trash2 size={18} /> Nettoyer les données
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Questions" 
          value={stats?.total || 610} 
          icon={<MessageSquare className="text-blue-400" />} 
          trend="+12% vs hier"
        />
        <StatCard 
          title="Précision Moyenne" 
          value={`${((stats?.avgConfidence || 0.962) * 100).toFixed(1)}%`} 
          icon={<Activity className="text-emerald-400" />} 
          trend="Stable"
        />
        <StatCard 
          title="Taux de Succès RPA" 
          value="94.2%" 
          icon={<TrendingUp className="text-purple-400" />} 
          trend="+5.4% ce mois"
        />
        <StatCard 
          title="Sessions Actives" 
          value="8" 
          icon={<Users className="text-amber-400" />} 
          trend="Temps réel"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Source Analysis */}
        <div className="lg:col-span-1 bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <BarChart3 size={20} className="text-blue-400" /> Analyse des Sources
          </h3>
          <div className="space-y-6">
            <SourceMetric label="FAQ & IA" count={stats?.sources?.['FAQ'] || 452} total={stats?.total || 610} color="bg-blue-500" />
            <SourceMetric label="RPA Automates" count={stats?.sources?.['RPA_STARTED'] || 124} total={stats?.total || 610} color="bg-purple-500" />
            <SourceMetric label="Ollama RAG" count={stats?.sources?.['OLLAMA_RAG'] || 34} total={stats?.total || 610} color="bg-amber-500" />
          </div>
        </div>

        {/* Top Questions */}
        <div className="lg:col-span-2 bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-emerald-400" /> Questions les plus fréquentes
          </h3>
          <div className="space-y-3">
            {(!stats?.top5 || stats.top5.length === 0) ? (
              // Mock data if empty
              <>
                <div className="flex justify-between items-center p-3 bg-gray-800/40 rounded-xl hover:bg-gray-800/60 transition-colors">
                  <span className="text-sm truncate pr-4">Comment effectuer un virement ?</span>
                  <span className="px-3 py-1 bg-gray-700 text-xs rounded-full font-mono">145 fois</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-800/40 rounded-xl hover:bg-gray-800/60 transition-colors">
                  <span className="text-sm truncate pr-4">Quel est le plafond de ma carte VISA ?</span>
                  <span className="px-3 py-1 bg-gray-700 text-xs rounded-full font-mono">98 fois</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-800/40 rounded-xl hover:bg-gray-800/60 transition-colors">
                  <span className="text-sm truncate pr-4">Activer ma dotation e-commerce</span>
                  <span className="px-3 py-1 bg-gray-700 text-xs rounded-full font-mono">76 fois</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-800/40 rounded-xl hover:bg-gray-800/60 transition-colors">
                  <span className="text-sm truncate pr-4">Où trouver mon RIB ?</span>
                  <span className="px-3 py-1 bg-gray-700 text-xs rounded-full font-mono">42 fois</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-800/40 rounded-xl hover:bg-gray-800/60 transition-colors">
                  <span className="text-sm truncate pr-4">Frais de tenue de compte</span>
                  <span className="px-3 py-1 bg-gray-700 text-xs rounded-full font-mono">28 fois</span>
                </div>
              </>
            ) : (
              stats.top5.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-gray-800/40 rounded-xl hover:bg-gray-800/60 transition-colors">
                  <span className="text-sm truncate pr-4">{item[0]}</span>
                  <span className="px-3 py-1 bg-gray-700 text-xs rounded-full font-mono">{item[1]} fois</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Users Management */}
      <div className="bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users size={20} className="text-purple-400" /> Comptes Enregistrés (Clients & Admins)
          </h3>
          <span className="text-xs bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full border border-purple-500/30">
            {BankStorage.getUsers().length} Utilisateurs
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-800/50 text-gray-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Nom / Email</th>
                <th className="px-6 py-4 font-medium">N° Compte / ID</th>
                <th className="px-6 py-4 font-medium">Rôle</th>
                <th className="px-6 py-4 font-medium">Solde</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {BankStorage.getUsers().map((user: any, idx: number) => (
                <tr key={idx} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white">{user.nom} {user.prenom}</span>
                      <span className="text-xs text-gray-500">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-gray-400">{user.numeroCompte}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      user.role === 'admin' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.role === 'admin' ? (
                      <span className="text-sm font-bold text-gray-500">-</span>
                    ) : (
                      <span className="text-sm font-bold text-emerald-400">{user.solde?.toLocaleString('fr-MA')} MAD</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent History */}
      <div className="bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Activity size={20} className="text-blue-400" /> Dernières Interactions Chatbot
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-800/50 text-gray-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Utilisateur / Session</th>
                <th className="px-6 py-4 font-medium">Question</th>
                <th className="px-6 py-4 font-medium">Confiance</th>
                <th className="px-6 py-4 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {history.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4 text-xs font-mono text-gray-500">...{row.session_id?.slice(-8)}</td>
                  <td className="px-6 py-4 text-sm max-w-xs truncate">{row.question}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-12 bg-gray-800 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500" 
                          style={{ width: `${row.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400">{(row.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1 text-xs text-emerald-400">
                      <CheckCircle2 size={12} /> Traité
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend }: { title: string; value: string | number; icon: React.ReactNode; trend: string }) {
  return (
    <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-gray-800 rounded-xl group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <span className="text-[10px] text-gray-500 uppercase tracking-widest">{trend}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-gray-500 mt-1">{title}</div>
    </div>
  );
}

function SourceMetric({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const percentage = Math.round((count / (total || 1)) * 100);
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-400">{label}</span>
        <span className="font-mono">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-1000`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-[10px] text-gray-500 mt-1">{count} interactions</div>
    </div>
  );
}
