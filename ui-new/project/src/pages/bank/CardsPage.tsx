import { useState, useEffect } from 'react';
import { BankStorage, BankUser } from '../../utils/BankStorage';
import { Globe, Plane, Lock, Unlock } from 'lucide-react';

const CardsPage = () => {
  const [user, setUser] = useState<BankUser | null>(null);

  useEffect(() => {
    const currentUserStr = localStorage.getItem('boa_bank_current_user');
    if (currentUserStr) {
      setUser(JSON.parse(currentUserStr));
    }
  }, []);

  if (!user || user.cartes.length === 0) return <div>Chargement...</div>;

  const card = user.cartes[0]; // Assuming 1 card for mockup

  const toggleOption = (option: 'bloquee' | 'dotationEcommerce' | 'dotationTouristique') => {
    const updatedUser = { ...user };
    updatedUser.cartes[0][option] = !updatedUser.cartes[0][option];
    BankStorage.updateUser(updatedUser);
    localStorage.setItem('boa_bank_current_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Visual Card Representation */}
      <div className={`relative h-56 rounded-2xl p-8 text-white shadow-xl overflow-hidden transition-all duration-300 ${card.bloquee ? 'bg-gray-800' : 'bg-gradient-to-tr from-blue-900 to-indigo-800'}`}>
        {/* Visa / Mastercard Mock Logo */}
        <div className="absolute top-8 right-8 italic font-bold text-2xl opacity-80">
          VISA
        </div>
        
        {/* Chip */}
        <div className="w-12 h-10 bg-yellow-400/80 rounded-md mb-8"></div>
        
        {/* Card Number */}
        <div className="text-2xl tracking-widest font-mono mb-4">
          {card.numero}
        </div>
        
        {/* Name and Validity */}
        <div className="flex justify-between uppercase tracking-wider text-sm">
          <div>{user.prenom} {user.nom}</div>
          <div>12/28</div>
        </div>

        {card.bloquee && (
          <div className="absolute inset-0 bg-red-900/60 backdrop-blur-sm flex items-center justify-center">
            <div className="flex items-center text-white text-xl font-bold">
              <Lock className="w-6 h-6 mr-2" /> CARTE BLOQUÉE
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Gestion de la carte</h3>
        </div>
        
        <div className="divide-y divide-gray-100">
          
          {/* Block / Unblock */}
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center">
              <div className={`p-3 rounded-full mr-4 ${card.bloquee ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                {card.bloquee ? <Lock className="w-6 h-6" /> : <Unlock className="w-6 h-6" />}
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Statut de la carte</h4>
                <p className="text-sm text-gray-500">Bloquez temporairement votre carte</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={!card.bloquee} onChange={() => toggleOption('bloquee')} />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>

          {/* E-Commerce */}
          <div className="p-6 flex items-center justify-between opacity-100">
            <div className="flex items-center">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-full mr-4">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Dotation E-Commerce</h4>
                <p className="text-sm text-gray-500">Achats sur internet à l'international</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" disabled={card.bloquee} checked={card.dotationEcommerce} onChange={() => toggleOption('dotationEcommerce')} />
              <div className={`w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all ${card.bloquee ? 'opacity-50' : 'peer-checked:bg-blue-600'}`}></div>
            </label>
          </div>

          {/* Tourist */}
          <div className="p-6 flex items-center justify-between opacity-100">
            <div className="flex items-center">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-full mr-4">
                <Plane className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Dotation Touristique</h4>
                <p className="text-sm text-gray-500">Paiements et retraits à l'étranger</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" disabled={card.bloquee} checked={card.dotationTouristique} onChange={() => toggleOption('dotationTouristique')} />
              <div className={`w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all ${card.bloquee ? 'opacity-50' : 'peer-checked:bg-blue-600'}`}></div>
            </label>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CardsPage;
