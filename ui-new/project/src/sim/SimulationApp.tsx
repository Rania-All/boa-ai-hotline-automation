import { useEffect, useMemo, useState } from 'react';
import {
  CreditCard, Wallet, ArrowRightLeft, Building2, Bell, Settings,
  LogOut, ShieldCheck, Activity, Search, RefreshCw, User, Lock, Mail, ChevronRight, CheckCircle2
} from 'lucide-react';
import {
  type AccountState,
  loadAccount,
  loadLogs,
  pushLog,
  saveAccount,
  type IntentCode,
  type OperationStatus,
} from './mockBank';

function getAccountRef() {
  const url = new URL(window.location.href);
  return url.searchParams.get('accountRef') ?? 'DEMO_ACC_001';
}

function fmt(n: number) {
  return new Intl.NumberFormat('fr-FR').format(n);
}

export default function SimulationApp() {
  const [authState, setAuthState] = useState<'login' | 'register' | 'authenticated'>('login');

  // Auth Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  const [accountRef, setAccountRef] = useState('DEMO_ACC_001');
  const [account, setAccount] = useState<AccountState>(() => loadAccount('DEMO_ACC_001'));
  const [logs, setLogs] = useState(() => loadLogs('DEMO_ACC_001'));
  const [result, setResult] = useState('—');
  const [beneficiary, setBeneficiary] = useState('BENEF_TEST');
  const [amount, setAmount] = useState('1000');
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const ref = getAccountRef();
    setAccountRef(ref);
    setAccount(loadAccount(ref));
    setLogs(loadLogs(ref));
  }, []);

  const cardStatusText = useMemo(
    () => (account.cardStatus === 'bloquee' ? 'Bloquée' : 'Active'),
    [account.cardStatus],
  );

  const runIntent = (intentCode: IntentCode) => {
    const ref = accountRef;
    const current = loadAccount(ref);
    let next = { ...current };
    let status: OperationStatus = 'SUCCESS';
    let details = '';

    if (intentCode === 'CARD_UNBLOCK') {
      if (current.cardStatus === 'debloquee') details = 'La carte est déjà débloquée.';
      else {
        next.cardStatus = 'debloquee';
        details = 'Carte débloquée avec succès.';
      }
    }

    if (intentCode === 'GET_BALANCE') {
      details = `Solde actualisé avec succès: ${fmt(current.balance)} DH.`;
    }

    if (intentCode === 'DOTATION_ACTIVATE') {
      if (current.dotationEcommerce) details = 'Dotation E-commerce déjà active sur ce compte.';
      else {
        next.dotationEcommerce = true;
        details = 'Dotation E-commerce activée avec succès.';
      }
    }

    if (intentCode === 'EXTERNAL_TRANSFER') {
      const amt = Number(String(amount).replace(',', '.'));
      if (!Number.isFinite(amt) || amt <= 0) {
        status = 'FAILED';
        details = 'Montant du bénéficiaire invalide.';
      } else if (amt > current.balance) {
        status = 'FAILED';
        details = 'Provision insuffisante pour effectuer ce virement.';
      } else {
        next.balance = Math.round((current.balance - amt) * 100) / 100;
        details = `Virement simulé vers ${beneficiary} (Montant: ${fmt(amt)} DH) a été validé.`;
      }
    }

    if (status === 'SUCCESS') saveAccount(ref, next);
    pushLog(ref, { timestamp: new Date().toISOString(), intentCode, status, details });
    setAccount(loadAccount(ref));
    setLogs(loadLogs(ref));
    setResult(`${status}: ${details}`);

    setTimeout(() => setResult('—'), 5000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingAuth(true);
    setAuthError('');
    setTimeout(() => {
      if (email.includes('@') && password.length > 3) {
        setAuthState('authenticated');
      } else {
        setAuthError('Identifiants invalides. Utilisez n\'importe quel e-mail et un mot de passe.');
      }
      setIsLoadingAuth(false);
    }, 800);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingAuth(true);
    setTimeout(() => {
      if (email.includes('@') && password.length > 3 && name.length > 2) {
        setAuthState('authenticated');
      } else {
        setAuthError('Veuillez remplir correctement tous les champs.');
      }
      setIsLoadingAuth(false);
    }, 800);
  };

  if (authState === 'login' || authState === 'register') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B3D91] to-[#041a45] flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-[#35B8C6] opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[30vw] h-[30vw] bg-[#125ebd] opacity-30 rounded-full blur-[100px]"></div>

        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10 border border-white/20">
          <div className="bg-slate-50 p-8 text-center border-b border-slate-100 flex flex-col items-center">
            <div className="w-16 h-16 bg-[#0B3D91] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/20 mb-4 transform hover:scale-105 transition-transform">
              <span className="text-white font-black text-2xl tracking-tighter">BOA</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800">BMCE Direct</h1>
            <p className="text-slate-500 text-sm mt-1">Plateforme de Simulation RPA</p>
          </div>

          <div className="p-8">
            <div className="flex mb-8 bg-slate-100 p-1 rounded-xl">
              <button
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${authState === 'login' ? 'bg-white text-[#0B3D91] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                onClick={() => { setAuthState('login'); setAuthError(''); }}
              >
                Connexion
              </button>
              <button
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${authState === 'register' ? 'bg-white text-[#0B3D91] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                onClick={() => { setAuthState('register'); setAuthError(''); }}
              >
                Inscription
              </button>
            </div>

            {authError && (
              <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium rounded-r-lg">
                {authError}
              </div>
            )}

            {authState === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-slate-500 mb-2">Adresse Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0B3D91]/20 focus:border-[#0B3D91] transition-all outline-none" placeholder="client@boa.ma" required />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-slate-500 mb-2">Mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0B3D91]/20 focus:border-[#0B3D91] transition-all outline-none" placeholder="••••••••" required />
                  </div>
                  <div className="text-right mt-2 text-xs font-semibold text-[#0B3D91] cursor-pointer hover:underline">Mot de passe oublié ?</div>
                </div>
                <button type="submit" disabled={isLoadingAuth} className="w-full py-3.5 bg-gradient-to-r from-[#0B3D91] to-[#124baf] text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2">
                  {isLoadingAuth ? <RefreshCw className="animate-spin" size={20} /> : 'Se Connecter'} <ChevronRight size={18} />
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-slate-500 mb-2">Nom complet</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0B3D91]/20 focus:border-[#0B3D91] transition-all outline-none" placeholder="Prenom Nom" required />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-slate-500 mb-2">Adresse Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0B3D91]/20 focus:border-[#0B3D91] transition-all outline-none" placeholder="client@boa.ma" required />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-slate-500 mb-2">Mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0B3D91]/20 focus:border-[#0B3D91] transition-all outline-none" placeholder="••••••••" required />
                  </div>
                </div>
                <button type="submit" disabled={isLoadingAuth} className="w-full py-3.5 bg-gradient-to-r from-[#0B3D91] to-[#124baf] text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 mt-2">
                  {isLoadingAuth ? <RefreshCw className="animate-spin" size={20} /> : 'Créer un compte'} <CheckCircle2 size={18} />
                </button>
              </form>
            )}

            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck size={14} /> Toutes vos données sont sécurisées
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard layout rendering (activeTab conditional mapping)
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 animate-fadeIn">
            <div className="col-span-1 md:col-span-2 p-6 rounded-2xl bg-gradient-to-r from-[#0B3D91] to-[#0a2c68] text-white shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-30 transform group-hover:scale-110 transition-transform duration-500">
                <Wallet size={80} />
              </div>
              <div className="text-blue-200 font-medium tracking-wide text-sm uppercase">Solde Total Disponible</div>
              <div id="balance-value" className="text-4xl sm:text-5xl font-bold mt-2 font-mono tracking-tight">
                {fmt(account.balance)} <span className="text-2xl text-blue-300">DH</span>
              </div>
              <div className="mt-6 flex items-center gap-4 text-sm font-medium">
                <div className="opacity-80">N° de compte :</div>
                <div id="account-number-masked" className="bg-white/10 px-3 py-1 rounded-md backdrop-blur-sm border border-white/20 tracking-wider">
                  {account.accountNumberMasked}
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mb-4">
                <CreditCard size={20} />
              </div>
              <div className="text-slate-500 text-sm font-medium mb-1">Statut Carte VISA</div>
              <div id="card-status" className={`text-xl font-bold ${account.cardStatus === 'bloquee' ? 'text-red-600' : 'text-emerald-600'}`}>
                {cardStatusText}
              </div>
              <div className="mt-3 text-xs text-slate-400">Dernière mise à jour : Aujourd'hui</div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full bg-[#35B8C6]/10 text-[#35B8C6] flex items-center justify-center mb-4">
                <Activity size={20} />
              </div>
              <div className="text-slate-500 text-sm font-medium mb-1">Dotation VNA</div>
              <div className="text-xl font-bold text-slate-800">
                {account.dotationEcommerce ? 'Activée' : 'Désactivée'}
              </div>
              <div className="mt-3 text-xs text-slate-400">Plafond E-commerce: 15 000 MAD</div>
            </div>

            {/* Quick Actions summary in Dashboard */}
            <div className="col-span-1 xl:col-span-4 mt-8">
              <h2 className="text-xl font-bold text-[#0B3D91] mb-5 border-b border-slate-100 pb-4">Activité Récente (Journal d'audit)</h2>
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="space-y-4 max-h-[300px] overflow-auto pr-2">
                  {logs.length === 0 ? (
                    <div className="h-24 flex flex-col items-center justify-center text-slate-400 space-y-3">
                      <Activity size={32} className="opacity-30" />
                      <span className="text-sm">Aucune activité</span>
                    </div>
                  ) : logs.map((l, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 group">
                      <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 shadow-sm ${l.status === 'SUCCESS' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 text-sm">{l.intentCode}</span>
                          <span className="text-xs text-slate-400 font-mono bg-white px-2 py-1 rounded shadow-sm border border-slate-200">{new Date(l.timestamp).toLocaleTimeString('fr-FR')}</span>
                        </div>
                        <div className="text-sm text-slate-600 mt-1.5 font-medium">{l.details}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'cards':
        return (
          <div className="animate-fadeIn space-y-6">
            <h2 className="text-2xl font-bold text-[#0B3D91] mb-2">Gestion des Cartes & Dotations</h2>
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <button onClick={() => runIntent('CARD_UNBLOCK')} className="p-6 rounded-2xl border-2 border-blue-100 bg-blue-50/30 hover:bg-blue-50 hover:border-blue-300 text-left transition-all group flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm"><CreditCard size={32} /></div>
                  <div className="font-bold text-lg text-slate-800">Débloquer la Carte</div>
                  <div className="text-sm text-slate-500 mt-2">Action immédiate - Active votre carte bloquée suite à une erreur PIN.</div>
                </button>
                <button onClick={() => runIntent('GET_BALANCE')} className="p-6 rounded-2xl border-2 border-slate-100 bg-slate-50/30 hover:bg-slate-50 hover:border-slate-300 text-left transition-all group flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-slate-200 text-slate-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm"><RefreshCw size={32} /></div>
                  <div className="font-bold text-lg text-slate-800">Actualiser les soldes</div>
                  <div className="text-sm text-slate-500 mt-2">Rafraîchit la synchronisation avec le serveur.</div>
                </button>
                <button onClick={() => runIntent('DOTATION_ACTIVATE')} className="p-6 rounded-2xl border-2 border-[#35B8C6]/20 bg-[#35B8C6]/5 hover:bg-[#35B8C6]/10 hover:border-[#35B8C6]/40 text-left transition-all group flex flex-col items-center text-center sm:col-span-2">
                  <div className="w-16 h-16 rounded-2xl bg-[#35B8C6]/20 text-[#218A96] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm"><Activity size={32} /></div>
                  <div className="font-bold text-lg text-slate-800">Activer Dotation E-Commerce</div>
                  <div className="text-sm text-slate-500 mt-2">Prépare votre carte pour les achats en ligne à l'international vna.</div>
                </button>
              </div>

              {result !== '—' && (
                <div className="mt-8 p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 animate-[fadeIn_0.3s_ease-out] shadow-sm flex items-center gap-3">
                  <ShieldCheck size={24} className="text-emerald-500" />
                  <div>
                    <div className="font-bold text-sm">Opération Enregistrée</div>
                    <div className="text-sm mt-1">{result}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'transfers':
        return (
          <div className="animate-fadeIn space-y-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-[#0B3D91] mb-2">Effectuer un Virement</h2>
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Sélectionner le compte à débiter</label>
                  <div className="p-4 border-2 border-[#0B3D91] rounded-xl bg-blue-50/50 flex items-center justify-between cursor-pointer">
                    <div>
                      <div className="font-bold text-[#0B3D91]">Compte Chèque Principal</div>
                      <div className="text-sm text-slate-500 font-mono mt-1">{account.accountNumberMasked}</div>
                    </div>
                    <div className="text-lg font-bold text-[#0B3D91]">{fmt(account.balance)} DH</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Nom du Bénéficiaire</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input value={beneficiary} onChange={(e) => setBeneficiary(e.target.value)} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0B3D91]/20 focus:border-[#0B3D91] transition-all outline-none" placeholder="Ex: Jean Dupont" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Montant à transférer (DH)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-lg">DH</span>
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full pl-16 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0B3D91]/20 focus:border-[#0B3D91] transition-all outline-none font-bold text-lg" placeholder="0" />
                  </div>
                </div>

                <button onClick={() => runIntent('EXTERNAL_TRANSFER')} className="w-full mt-4 p-4 bg-gradient-to-r from-[#0B3D91] to-[#124baf] text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-900/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex justify-center items-center gap-3">
                  <ArrowRightLeft size={22} /> Valider le virement
                </button>
              </div>

              {result !== '—' && (
                <div className="mt-8 p-5 rounded-xl border-l-4 border-l-emerald-500 bg-slate-50 border border-slate-200 animate-[fadeIn_0.3s_ease-out] shadow-sm">
                  <span className="font-bold text-slate-800">Bilan d'exécution : </span>
                  <span className="text-slate-600 ml-2">{result}</span>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-[#F4F7FB] font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#0B3D91] text-white flex flex-col shadow-2xl relative z-20">
        <div className="p-6 flex flex-col items-center border-b border-white/10">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-2 shadow-lg mb-4">
            <div className="text-[#0B3D91] font-bold text-2xl tracking-tighter">BOA</div>
          </div>
          <h2 className="text-xl font-bold tracking-wide">BMCE DIRECT</h2>
          <span className="text-xs text-[#35B8C6] tracking-widest uppercase mt-1">Espace Client</span>
        </div>

        <nav className="flex-1 py-8 px-4 space-y-3 relative">
          <button
            onClick={() => { setActiveTab('dashboard'); setResult('—'); }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-white text-[#0B3D91] shadow-lg font-bold' : 'text-blue-100 hover:bg-white/10 hover:text-white'}`}
          >
            <Wallet size={20} className={activeTab === 'dashboard' ? 'text-[#0B3D91]' : ''} />
            Mes Comptes
          </button>
          <button
            onClick={() => { setActiveTab('cards'); setResult('—'); }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${activeTab === 'cards' ? 'bg-white text-[#0B3D91] shadow-lg font-bold' : 'text-blue-100 hover:bg-white/10 hover:text-white'}`}
          >
            <CreditCard size={20} className={activeTab === 'cards' ? 'text-[#0B3D91]' : ''} />
            Cartes Bancaires
          </button>
          <button
            onClick={() => { setActiveTab('transfers'); setResult('—'); }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${activeTab === 'transfers' ? 'bg-white text-[#0B3D91] shadow-lg font-bold' : 'text-blue-100 hover:bg-white/10 hover:text-white'}`}
          >
            <ArrowRightLeft size={20} className={activeTab === 'transfers' ? 'text-[#0B3D91]' : ''} />
            Virements
          </button>
        </nav>

        <div className="p-4 border-t border-white/10 bg-blue-900/50">
          <div className="flex items-center gap-3 px-4 py-3 text-blue-200 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer">
            <Settings size={20} />
            <span>Paramètres</span>
          </div>
          <button onClick={() => setAuthState('login')} className="w-full flex items-center gap-3 px-4 py-3 text-red-300 hover:text-white hover:bg-red-500/80 rounded-xl transition-all cursor-pointer mt-1">
            <LogOut size={20} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10">
          <div className="flex items-center gap-4 text-slate-500">
            <Search size={22} className="cursor-pointer hover:text-slate-800 transition-colors" />
            <span className="h-5 w-px bg-slate-200"></span>
            <div className="text-sm font-medium">Interface Simulation RPA</div>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-500 hover:text-slate-800 transition">
              <Bell size={22} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse border border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-slate-800 group-hover:text-[#0B3D91] transition-colors">{name || 'Client Test'}</div>
                <div className="text-xs text-slate-500">{accountRef}</div>
              </div>
              <div className="w-10 h-10 bg-gradient-to-tr from-[#0B3D91] to-[#35B8C6] rounded-full flex justify-center items-center text-white font-bold shadow-md shadow-blue-500/20">
                {name ? name.charAt(0).toUpperCase() : 'CL'}
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}
