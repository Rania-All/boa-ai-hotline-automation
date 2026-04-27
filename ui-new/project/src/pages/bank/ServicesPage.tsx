import { useState } from 'react';
import { Book, CreditCard, CheckCircle } from 'lucide-react';

const ServicesPage = () => {
  const [successMsg, setSuccessMsg] = useState('');

  const handleOrder = (type: string) => {
    setSuccessMsg(`Votre demande de ${type} a été enregistrée avec succès.`);
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {successMsg && (
        <div className="bg-green-50 p-4 rounded-lg border border-green-200 flex items-center text-green-800">
          <CheckCircle className="w-5 h-5 mr-2" />
          {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Chequier */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
            <Book className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Commander un Chéquier</h3>
          <p className="text-gray-500 text-sm flex-1 mb-6">
            Commandez un nouveau chéquier de 25 ou 50 formules. Il sera mis à votre disposition dans votre agence.
          </p>
          <button 
            onClick={() => handleOrder('chéquier')}
            className="w-full py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium rounded-lg transition-colors"
          >
            Commander
          </button>
        </div>

        {/* Renouvellement Carte */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
            <CreditCard className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Renouvellement de Carte</h3>
          <p className="text-gray-500 text-sm flex-1 mb-6">
            Demandez le remplacement de votre carte bancaire en cas de perte, vol, ou si elle est défectueuse.
          </p>
          <button 
            onClick={() => handleOrder('renouvellement de carte')}
            className="w-full py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium rounded-lg transition-colors"
          >
            Faire une demande
          </button>
        </div>

      </div>
    </div>
  );
};

export default ServicesPage;
