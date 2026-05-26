import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  ShieldAlert, 
  Trash2, 
  RefreshCcw, 
  CheckCircle2,
  TrendingUp,
  Activity,
  Bot,
  UserCheck,
  Plus,
  Pencil,
  X,
  Save
} from 'lucide-react';
import { getHistory, clearHistory } from '../services/api';
import { BankStorage } from '../utils/BankStorage';

interface Stats {
  total: number;
  avgConfidence: number;
  maxConfidence: number;
  sources: Record<string, number>;
  top5: Array<[string, number]>;
  uniqueUsers: number;
  uniqueSessions: number;
  satisfactionRate: number;
  rpaCount: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);
  const [usersList, setUsersList] = useState<any[]>([]);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  // Form states
  const [formNom, setFormNom] = useState('');
  const [formPrenom, setFormPrenom] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formTelephone, setFormTelephone] = useState('');
  const [formGenre, setFormGenre] = useState<'M' | 'F'>('M');
  const [formCin, setFormCin] = useState('');
  const [formNationalite, setFormNationalite] = useState('Marocaine');
  const [formDateNaissance, setFormDateNaissance] = useState('');
  const [formNumeroCompte, setFormNumeroCompte] = useState('');
  const [formMotDePasse, setFormMotDePasse] = useState('123456789');
  const [formSolde, setFormSolde] = useState(15000);
  const [formRole, setFormRole] = useState<'user' | 'admin'>('user');

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';
      const statsRes = await fetch(`${BACKEND_URL}/api/admin/stats`);
      const statsData = await statsRes.json();
      setStats(statsData);

      const historyData = await getHistory();
      setHistory(historyData.slice(0, 10));

      // Fetch Registered Users and save in state
      setUsersList(BankStorage.getRegisteredUsers());
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

  // CRUD Handlers
  const handleDeleteUser = (userId: string) => {
    const u = BankStorage.getUsers().find(user => user.id === userId);
    if (!u) return;
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer le compte de ${u.prenom} ${u.nom} ?`)) return;
    
    const allUsers = BankStorage.getUsers().filter(user => user.id !== userId);
    BankStorage.saveUsers(allUsers);
    
    // Refresh
    fetchDashboardData();
  };

  const handleOpenAddModal = () => {
    setModalMode('add');
    setEditingUserId(null);
    setFormNom('');
    setFormPrenom('');
    setFormEmail('');
    setFormTelephone('');
    setFormGenre('M');
    setFormCin('');
    setFormNationalite('Marocaine');
    setFormDateNaissance('2003-10-24');
    // Generate fresh random account number and card
    setFormNumeroCompte('011' + Math.floor(1000000 + Math.random() * 9000000).toString());
    setFormMotDePasse('123456789');
    setFormSolde(15000);
    setFormRole('user');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: any) => {
    setModalMode('edit');
    setEditingUserId(user.id);
    setFormNom(user.nom);
    setFormPrenom(user.prenom);
    setFormEmail(user.email);
    setFormTelephone(user.telephone);
    setFormGenre(user.genre);
    setFormCin(user.cin);
    setFormNationalite(user.nationalite);
    setFormDateNaissance(user.dateNaissance);
    setFormNumeroCompte(user.numeroCompte);
    setFormMotDePasse(user.motDePasse || '123456789');
    setFormSolde(user.solde || 0);
    setFormRole(user.role || 'user');
    setIsModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    const allUsers = BankStorage.getUsers();

    if (modalMode === 'add') {
      const newUser = {
        id: crypto.randomUUID(),
        nom: formNom.toUpperCase(),
        prenom: formPrenom,
        telephone: formTelephone,
        genre: formGenre,
        cin: formCin.toUpperCase(),
        nationalite: formNationalite,
        email: formEmail,
        dateNaissance: formDateNaissance,
        numeroCompte: formNumeroCompte,
        motDePasse: formMotDePasse,
        solde: Number(formSolde),
        role: formRole,
        cartes: [{
          numero: '4242 ' + Math.floor(1000 + Math.random() * 9000).toString() + ' ' + Math.floor(1000 + Math.random() * 9000).toString() + ' ' + Math.floor(1000 + Math.random() * 9000).toString(),
          bloquee: false,
          dotationEcommerce: false,
          dotationTouristique: false
        }],
        transactions: [{
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          montant: Number(formSolde),
          type: 'CREDIT' as const,
          libelle: 'Versement Initial (Superviseur)'
        }]
      };
      allUsers.push(newUser);
    } else {
      const idx = allUsers.findIndex(u => u.id === editingUserId);
      if (idx !== -1) {
        allUsers[idx] = {
          ...allUsers[idx],
          nom: formNom.toUpperCase(),
          prenom: formPrenom,
          email: formEmail,
          telephone: formTelephone,
          genre: formGenre,
          cin: formCin.toUpperCase(),
          nationalite: formNationalite,
          dateNaissance: formDateNaissance,
          numeroCompte: formNumeroCompte,
          motDePasse: formMotDePasse,
          solde: Number(formSolde),
          role: formRole
        };
      }
    }

    BankStorage.saveUsers(allUsers);
    setIsModalOpen(false);
    fetchDashboardData();
  };

  if (isLoading && !stats) {
    return (
      <div className="flex items-center justify-center h-full text-white bg-[var(--bg-deep)]">
        <RefreshCcw className="animate-spin mr-2" /> Chargement du dashboard...
      </div>
    );
  }

  const total = stats?.total ?? 0;
  const avgConf = stats?.avgConfidence ?? 0;
  const uniqueSessions = stats?.uniqueSessions ?? 0;
  const uniqueUsers = stats?.uniqueUsers ?? 0;
  const satisfactionRate = stats?.satisfactionRate ?? 0;
  const rpaCount = stats?.rpaCount ?? 0;
  const sources = stats?.sources ?? {};
  const top5 = stats?.top5 ?? [];

  const faqCount = sources['FAQ'] ?? 0;
  const rpaStartedCount = sources['RPA_STARTED'] ?? 0;
  const ollamaCount = sources['OLLAMA_RAG'] ?? 0;

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
          value={total} 
          icon={<MessageSquare className="text-blue-400" />} 
          trend="Toutes sessions"
        />
        <StatCard 
          title="Précision Moyenne" 
          value={total > 0 ? `${(avgConf * 100).toFixed(1)}%` : 'N/A'} 
          icon={<Activity className="text-emerald-400" />} 
          trend={total > 0 ? `Max: ${((stats?.maxConfidence ?? 0) * 100).toFixed(0)}%` : 'Aucune donnée'}
        />
        <StatCard 
          title="Taux de Satisfaction" 
          value={total > 0 ? `${satisfactionRate}%` : 'N/A'} 
          icon={<TrendingUp className="text-purple-400" />} 
          trend="Confiance ≥ 70%"
        />
        <StatCard 
          title="Sessions Distinctes" 
          value={uniqueSessions} 
          icon={<Users className="text-amber-400" />} 
          trend={`${uniqueUsers} utilisateur(s)`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Source Analysis */}
        <div className="lg:col-span-1 bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <BarChart3 size={20} className="text-blue-400" /> Analyse des Sources
          </h3>
          {total === 0 ? (
            <div className="text-center text-gray-500 py-8 text-sm">Aucune interaction enregistrée.</div>
          ) : (
            <div className="space-y-6">
              <SourceMetric label="FAQ & IA" count={faqCount} total={total} color="bg-blue-500" />
              <SourceMetric label="RPA Automatisé" count={rpaStartedCount} total={total} color="bg-purple-500" />
              <SourceMetric label="Ollama RAG" count={ollamaCount} total={total} color="bg-amber-500" />
            </div>
          )}
        </div>

        {/* Top Questions */}
        <div className="lg:col-span-2 bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-emerald-400" /> Questions les plus fréquentes
          </h3>
          <div className="space-y-3">
            {top5.length === 0 ? (
              <div className="text-center text-gray-500 py-8 text-sm">
                Aucune question enregistrée pour le moment.
              </div>
            ) : (
              top5.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-gray-800/40 rounded-xl hover:bg-gray-800/60 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-bold text-gray-500 w-4 shrink-0">#{idx + 1}</span>
                    <span className="text-sm truncate">{item[0]}</span>
                  </div>
                  <span className="px-3 py-1 bg-gray-700 text-xs rounded-full font-mono ml-3 shrink-0">{item[1]}x</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* RPA Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900/50 p-5 rounded-2xl border border-gray-800 flex items-center gap-4">
          <div className="p-3 bg-purple-500/20 rounded-xl">
            <Bot className="text-purple-400" size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold">{rpaCount}</div>
            <div className="text-sm text-gray-400">Jobs RPA déclenchés</div>
          </div>
        </div>
        <div className="bg-gray-900/50 p-5 rounded-2xl border border-gray-800 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/20 rounded-xl">
            <UserCheck className="text-emerald-400" size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold">{usersList.length}</div>
            <div className="text-sm text-gray-400">Comptes Clients Actifs</div>
          </div>
        </div>
        <div className="bg-gray-900/50 p-5 rounded-2xl border border-gray-800 flex items-center gap-4">
          <div className="p-3 bg-amber-500/20 rounded-xl">
            <BarChart3 className="text-amber-400" size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold">{ollamaCount}</div>
            <div className="text-sm text-gray-400">Réponses via RAG Ollama</div>
          </div>
        </div>
      </div>

      {/* Users Management */}
      <div className="bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users size={20} className="text-purple-400" /> Comptes Créés par les Clients
          </h3>
          <div className="flex items-center gap-4">
            <span className="text-xs bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full border border-purple-500/30">
              {usersList.length} Compte(s) inscrit(s)
            </span>
            <button 
              onClick={handleOpenAddModal}
              className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition-colors shadow-lg shadow-purple-600/20"
            >
              <Plus size={14} /> Ajouter un utilisateur
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-800/50 text-gray-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Nom / Email</th>
                <th className="px-6 py-4 font-medium">N° Compte</th>
                <th className="px-6 py-4 font-medium">Rôle</th>
                <th className="px-6 py-4 font-medium">Solde</th>
                <th className="px-6 py-4 font-medium">Date de naissance</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {usersList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 text-sm">
                    Aucun compte client créé pour le moment.
                  </td>
                </tr>
              ) : (
                usersList.map((user: any, idx: number) => (
                  <tr key={idx} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white">{user.nom} {user.prenom}</span>
                        <span className="text-xs text-gray-500">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-gray-400">{user.numeroCompte}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-emerald-400">{user.solde?.toLocaleString('fr-MA')} MAD</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {user.dateNaissance}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleOpenEditModal(user)}
                          className="p-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded border border-blue-500/20 transition-colors"
                          title="Modifier"
                        >
                          <Pencil size={14} />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded border border-red-500/20 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent History */}
      <div className="bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Activity size={20} className="text-blue-400" /> Dernières Interactions Chatbot
          </h3>
          <span className="text-xs text-gray-500">{history.length > 0 ? `${history.length} affichées` : 'Aucune'}</span>
        </div>
        {history.length === 0 ? (
          <div className="text-center text-gray-500 py-12 text-sm">
            Aucune interaction enregistrée dans la base de données.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-800/50 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Utilisateur</th>
                  <th className="px-6 py-4 font-medium">Question</th>
                  <th className="px-6 py-4 font-medium">Source</th>
                  <th className="px-6 py-4 font-medium">Confiance</th>
                  <th className="px-6 py-4 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {history.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4 text-xs text-gray-400">
                      {row.user_email ? (
                        <span className="font-mono">{row.user_email}</span>
                      ) : (
                        <span className="text-gray-600 font-mono">...{row.session_id?.slice(-8)}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm max-w-xs truncate">{row.question}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        row.source === 'RPA_STARTED' ? 'bg-purple-500/20 text-purple-400' :
                        row.source === 'OLLAMA_RAG' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {row.source || 'FAQ'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-gray-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${row.confidence >= 0.7 ? 'bg-emerald-500' : 'bg-amber-500'}`}
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
        )}
      </div>

      {/* Elegant CRUD Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-fadeIn">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-800/20">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="text-purple-400" size={20} />
                {modalMode === 'add' ? 'Créer un Nouveau Compte Client' : 'Modifier les Informations du Client'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveUser} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Prénom</label>
                  <input 
                    type="text" 
                    required 
                    value={formPrenom} 
                    onChange={e => setFormPrenom(e.target.value)} 
                    className="w-full bg-gray-800/80 border border-gray-700/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    placeholder="Prénom de l'utilisateur"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Nom</label>
                  <input 
                    type="text" 
                    required 
                    value={formNom} 
                    onChange={e => setFormNom(e.target.value)} 
                    className="w-full bg-gray-800/80 border border-gray-700/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    placeholder="NOM DE FAMILLE"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Email</label>
                  <input 
                    type="email" 
                    required 
                    value={formEmail} 
                    onChange={e => setFormEmail(e.target.value)} 
                    className="w-full bg-gray-800/80 border border-gray-700/50 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    placeholder="client@mail.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Téléphone</label>
                  <input 
                    type="text" 
                    required 
                    value={formTelephone} 
                    onChange={e => setFormTelephone(e.target.value)} 
                    className="w-full bg-gray-800/80 border border-gray-700/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    placeholder="0600000000"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">N° de Compte Bancaire</label>
                  <input 
                    type="text" 
                    required 
                    value={formNumeroCompte} 
                    onChange={e => setFormNumeroCompte(e.target.value)} 
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-2.5 text-sm text-gray-400 font-mono focus:outline-none"
                    placeholder="N° Compte unique"
                    disabled={modalMode === 'edit'} // No changing account numbers after creation for system stability
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Mot de Passe de Connexion</label>
                  <input 
                    type="text" 
                    required 
                    value={formMotDePasse} 
                    onChange={e => setFormMotDePasse(e.target.value)} 
                    className="w-full bg-gray-800/80 border border-gray-700/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    placeholder="motdepasse123"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">CIN</label>
                  <input 
                    type="text" 
                    required 
                    value={formCin} 
                    onChange={e => setFormCin(e.target.value)} 
                    className="w-full bg-gray-800/80 border border-gray-700/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    placeholder="AB123456"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Solde Actuel (MAD)</label>
                  <input 
                    type="number" 
                    required 
                    value={formSolde} 
                    onChange={e => setFormSolde(Number(e.target.value))} 
                    className="w-full bg-gray-800/80 border border-gray-700/50 rounded-xl px-4 py-2.5 text-sm font-bold text-emerald-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    placeholder="15000"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Nationalité</label>
                  <input 
                    type="text" 
                    required 
                    value={formNationalite} 
                    onChange={e => setFormNationalite(e.target.value)} 
                    className="w-full bg-gray-800/80 border border-gray-700/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Date de Naissance</label>
                  <input 
                    type="date" 
                    required 
                    value={formDateNaissance} 
                    onChange={e => setFormDateNaissance(e.target.value)} 
                    className="w-full bg-gray-800/80 border border-gray-700/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Genre</label>
                  <select 
                    value={formGenre} 
                    onChange={e => setFormGenre(e.target.value as 'M' | 'F')}
                    className="w-full bg-gray-800/80 border border-gray-700/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-all"
                  >
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Rôle Système</label>
                  <select 
                    value={formRole} 
                    onChange={e => setFormRole(e.target.value as 'user' | 'admin')}
                    className="w-full bg-gray-800/80 border border-gray-700/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-all"
                  >
                    <option value="user">Utilisateur (Client)</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </div>
              </div>

              {/* Modal Footer / Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800 mt-6">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm font-bold transition-all"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-purple-600/20"
                >
                  <Save size={16} /> Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
        <span className="text-[10px] text-gray-500 uppercase tracking-widest text-right max-w-[100px]">{trend}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-gray-500 mt-1">{title}</div>
    </div>
  );
}

function SourceMetric({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
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
      <div className="text-[10px] text-gray-500 mt-1">{count} interaction{count !== 1 ? 's' : ''}</div>
    </div>
  );
}
