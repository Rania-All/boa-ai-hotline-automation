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
    <div className="space-y-6">
      {/* Balance Card */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-blue-100 font-medium">Solde Actuel</h3>
          <Wallet className="text-blue-200" />
        </div>
        <div className="text-4xl font-bold mb-2">{user.solde.toLocaleString('fr-MA')} MAD</div>
        <p className="text-blue-100 text-sm">Compte Chèque N° {user.numeroCompte}</p>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Historique des opérations</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {user.transactions.length === 0 ? (
            <div className="p-6 text-center text-gray-500">Aucune opération récente</div>
          ) : (
            user.transactions.map((tx) => (
              <div key={tx.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${tx.type === 'CREDIT' ? 'bg-green-100' : 'bg-red-100'}`}>
                    {tx.type === 'CREDIT' ? (
                      <ArrowDownRight className="w-5 h-5 text-green-600" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{tx.libelle}</p>
                    <p className="text-sm text-gray-500">{new Date(tx.date).toLocaleDateString('fr-MA', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
                <div className={`font-semibold ${tx.type === 'CREDIT' ? 'text-green-600' : 'text-gray-800'}`}>
                  {tx.type === 'CREDIT' ? '+' : '-'}{tx.montant.toLocaleString('fr-MA')} MAD
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
