import { useEffect, useState } from 'react';
import { BankStorage, BankUser } from '../../utils/BankStorage';
import { ArrowDownRight, ArrowUpRight, Wallet } from 'lucide-react';

const DashboardHome = () => {
  const [user, setUser] = useState<BankUser | null>(null);

  useEffect(() => {
    const currentUserStr = localStorage.getItem('boa_bank_current_user');
    if (currentUserStr) {
      const parsedUser = JSON.parse(currentUserStr);
      // Refresh from storage to get latest balance/transactions
      const freshUser = BankStorage.getUserByCompte(parsedUser.numeroCompte);
      setUser(freshUser || null);
    }
  }, []);

  if (!user) return <div>Chargement...</div>;

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Top Section with Balance and Quick Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Premium Balance Card */}
        <div className="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-blue-900/20 group">
          {/* Decorative Mesh Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-blue-100/80 text-sm font-bold uppercase tracking-widest mb-1">Solde de votre compte</p>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black tracking-tight">Compte Chèque Privilège</h3>
                  <div className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold">ACTIF</div>
                </div>
              </div>
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                <Wallet className="w-6 h-6" />
              </div>
            </div>

            <div>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-6xl font-black tracking-tighter tabular-nums">{user.solde.toLocaleString('fr-MA')}</span>
                <span className="text-2xl font-bold text-blue-200 uppercase tracking-widest">MAD</span>
              </div>
              <div className="flex items-center gap-4 text-blue-100/60 font-mono text-sm">
                <span>N° {user.numeroCompte.replace(/(\d{4})/g, '$1 ')}</span>
                <div className="w-1 h-1 rounded-full bg-blue-300" />
                <span>RIB Valide</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats / Info */}
        <div className="flex flex-col gap-6">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <ArrowDownRight size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Entrées (30j)</p>
              <p className="text-lg font-black text-slate-800">+ 4.500,00 MAD</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
              <ArrowUpRight size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Sorties (30j)</p>
              <p className="text-lg font-black text-slate-800">- 2.340,50 MAD</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-200/60 overflow-hidden">
        <div className="p-10 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Dernières Opérations</h3>
            <p className="text-slate-400 text-sm mt-1">Historique sécurisé de vos transactions bancaires.</p>
          </div>
          <button className="text-blue-600 font-bold text-sm hover:underline">Voir tout</button>
        </div>
        
        <div className="divide-y divide-slate-50">
          {!user.transactions || user.transactions.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Wallet className="w-10 h-10 text-slate-200" />
              </div>
              <p className="text-slate-400 font-medium">Aucune opération n'a été enregistrée pour le moment.</p>
            </div>
          ) : (
            user.transactions.map((tx: any) => (
              <div key={tx.id} className="p-8 flex items-center justify-between hover:bg-slate-50/80 transition-all cursor-default group">
                <div className="flex items-center space-x-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                    tx.type === 'CREDIT' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {tx.type === 'CREDIT' ? (
                      <ArrowDownRight className="w-6 h-6" />
                    ) : (
                      <ArrowUpRight className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <p className="font-black text-slate-800 text-lg group-hover:text-blue-600 transition-colors">{tx.libelle || 'Opération Bancaire'}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-slate-400 font-medium">
                        {tx.date ? new Date(tx.date).toLocaleDateString('fr-MA', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Date inconnue'}
                      </p>
                      <div className="w-1 h-1 rounded-full bg-slate-200" />
                      <p className="text-sm text-slate-400 font-medium">
                        {tx.date ? new Date(tx.date).toLocaleTimeString('fr-MA', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-xl font-black tabular-nums ${tx.type === 'CREDIT' ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {tx.type === 'CREDIT' ? '+' : '-'}{(tx.montant || 0).toLocaleString('fr-MA')} <span className="text-sm font-bold opacity-50">MAD</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Confirmé</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
