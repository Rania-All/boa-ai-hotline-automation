import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BankStorage, BankUser } from '../../utils/BankStorage';
import { Globe, Plane, Lock, Unlock, Shield, Bot } from 'lucide-react';

const CardsPage = () => {
  const [user, setUser] = useState<BankUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUserStr = localStorage.getItem('boa_bank_current_user');
    if (currentUserStr) {
      setUser(JSON.parse(currentUserStr));
    }
  }, []);

  if (!user || user.cartes.length === 0) return <div className="p-10 text-center text-slate-500">Chargement de votre carte...</div>;

  const card = user.cartes[0];

  const toggleOption = (option: 'bloquee' | 'dotationEcommerce' | 'dotationTouristique') => {
    if (option === 'bloquee') BankStorage.setCardStatus(user.numeroCompte, !card.bloquee);
    if (option === 'dotationEcommerce') BankStorage.setDotationEcommerce(user.numeroCompte, !card.dotationEcommerce);
    if (option === 'dotationTouristique') BankStorage.setDotationTouristique(user.numeroCompte, !card.dotationTouristique);

    const updatedUser = BankStorage.getUserByCompte(user.numeroCompte);
    if (updatedUser) {
      setUser(updatedUser);
      localStorage.setItem('boa_bank_current_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Header with Back button */}
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 bg-white text-slate-600 hover:text-blue-600 rounded-xl border border-slate-200 transition-all font-bold text-sm shadow-sm hover:shadow"
        >
          <Bot size={18} /> Retour au Chatbot
        </button>
      </div>

      {/* Visual Card Representation */}
      <div className={`relative h-64 rounded-[2rem] p-10 text-white shadow-2xl overflow-hidden transition-all duration-500 transform hover:scale-[1.01] ${card.bloquee ? 'bg-slate-900 grayscale' : 'bg-gradient-to-br from-[#0B3D91] via-[#124baf] to-[#35B8C6]'}`}>
        {/* Background Patterns */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/10 rounded-full blur-2xl -ml-10 -mb-10"></div>

        <div className="relative z-10 flex flex-col h-full justify-between">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-1">Bank Of Africa</span>
              <span className="text-xl font-bold tracking-tighter">PREMIUM VISA</span>
            </div>
            <div className="italic font-black text-3xl opacity-90 tracking-tighter">VISA</div>
          </div>
          
          <div>
            <div className="w-14 h-11 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-lg mb-6 shadow-inner relative overflow-hidden">
               <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,black_2px,black_4px)]"></div>
            </div>
            <div className="text-3xl tracking-[0.25em] font-mono mb-2 drop-shadow-lg">
              {card.numero}
            </div>
          </div>
          
          <div className="flex justify-between items-end uppercase tracking-widest">
            <div className="flex flex-col">
              <span className="text-[8px] opacity-50 mb-1 font-bold">Titulaire du compte</span>
              <span className="text-sm font-bold">{user.prenom} {user.nom}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[8px] opacity-50 mb-1 font-bold">Expire Fin</span>
              <span className="text-sm font-bold">12/28</span>
            </div>
          </div>
        </div>

        {card.bloquee && (
          <div className="absolute inset-0 bg-red-950/80 backdrop-blur-md flex flex-col items-center justify-center z-20 animate-fadeIn">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-4 border border-red-500/30">
              <Lock className="w-10 h-10 text-red-400" />
            </div>
            <div className="text-white text-2xl font-black tracking-tighter uppercase">CARTE BLOQUÉE</div>
            <p className="text-red-200/60 text-xs mt-2 font-medium">Sécurité activée</p>
          </div>
        )}
      </div>

      {/* Controls Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card Status Control */}
        <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-100 flex flex-col justify-between group hover:shadow-md transition-all">
          <div className="flex items-center gap-4 mb-6">
            <div className={`p-4 rounded-2xl transition-colors ${card.bloquee ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
              {card.bloquee ? <Lock className="w-6 h-6" /> : <Unlock className="w-6 h-6" />}
            </div>
            <div>
              <h4 className="font-bold text-slate-800">Sécurité Carte</h4>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Statut: {card.bloquee ? 'Bloquée' : 'Active'}</p>
            </div>
          </div>
          
          <button 
            id="btn-toggle-block"
            onClick={() => toggleOption('bloquee')}
            className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              card.bloquee 
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600' 
              : 'bg-red-50 text-red-600 hover:bg-red-100'
            }`}
          >
            {card.bloquee ? (
              <><Unlock size={16} /> Débloquer la carte</>
            ) : (
              <><Lock size={16} /> Bloquer la carte</>
            )}
          </button>
        </div>

        {/* E-Commerce Control */}
        <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-100 flex flex-col justify-between group hover:shadow-md transition-all">
          <div className="flex items-center gap-4 mb-6">
            <div className={`p-4 rounded-2xl transition-colors ${card.dotationEcommerce ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'}`}>
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800">E-Commerce</h4>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Dotation Int.</p>
            </div>
          </div>
          
          <button 
            id="btn-toggle-ecommerce"
            disabled={card.bloquee}
            onClick={() => toggleOption('dotationEcommerce')}
            className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              card.dotationEcommerce 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            } ${card.bloquee ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {card.dotationEcommerce ? 'Désactiver VNA' : 'Activer VNA'}
          </button>
        </div>

        {/* Tourist Control */}
        <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-100 flex flex-col justify-between group hover:shadow-md transition-all">
          <div className="flex items-center gap-4 mb-6">
            <div className={`p-4 rounded-2xl transition-colors ${card.dotationTouristique ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'}`}>
              <Plane className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800">Touristique</h4>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Dotation Voyage</p>
            </div>
          </div>
          
          <button 
            id="btn-toggle-touristique"
            disabled={card.bloquee}
            onClick={() => toggleOption('dotationTouristique')}
            className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              card.dotationTouristique 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            } ${card.bloquee ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {card.dotationTouristique ? 'Désactiver' : 'Activer'}
          </button>
        </div>

      </div>

      {/* Info Panel */}
      <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl flex gap-4">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shrink-0">
          <Shield size={20} />
        </div>
        <div>
          <h5 className="font-bold text-blue-900">Information Sécurité</h5>
          <p className="text-sm text-blue-700 mt-1">
            Toutes les modifications de dotations sont instantanées et sécurisées. En cas de perte de votre carte, utilisez le bouton de blocage immédiat.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardsPage;
