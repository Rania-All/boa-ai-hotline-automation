import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BankStorage } from '../../utils/BankStorage';
import { Shield, AlertTriangle } from 'lucide-react';

const BankLogin = () => {
  const [numeroCompte, setNumeroCompte] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLocked) {
      setError("Compte bloqué. Veuillez vérifier votre boîte mail.");
      return;
    }

    const user = BankStorage.getUserByCompte(numeroCompte);

    if (user && user.motDePasse === password) {
      // Success
      localStorage.setItem('boa_bank_current_user', JSON.stringify(user));
      navigate('/bank/dashboard');
    } else {
      // Failed attempt
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 3) {
        setIsLocked(true);
        // Simulate sending email
        setToastMessage("📧 EMAIL ENVOYÉ : Réinitialisation du mot de passe envoyée à votre adresse email enregistrée.");
        setTimeout(() => setToastMessage(''), 8000);
      } else {
        setError(`Identifiants incorrects. Tentatives restantes : ${3 - newAttempts}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      {/* Toast Notification for Simulated Email */}
      {toastMessage && (
        <div className="fixed top-4 right-4 max-w-sm bg-blue-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-start space-x-3 z-50 animate-fade-in-down">
          <Shield className="w-6 h-6 flex-shrink-0" />
          <p className="text-sm font-medium">{toastMessage}</p>
        </div>
      )}

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          BANK OF AFRICA
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Espace Client Sécurisé
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200">
          <form className="space-y-6" onSubmit={handleLogin}>
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="compte" className="block text-sm font-medium text-gray-700">
                Numéro de Compte
              </label>
              <div className="mt-1">
                <input
                  id="compte"
                  name="compte"
                  type="text"
                  required
                  disabled={isLocked}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                  value={numeroCompte}
                  onChange={(e) => setNumeroCompte(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de Passe
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  disabled={isLocked}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLocked}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isLocked ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-900 hover:bg-blue-800'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
              >
                Se Connecter
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Nouveau client ?</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => navigate('/bank/register')}
                className="w-full flex justify-center py-2 px-4 border border-blue-900 rounded-md shadow-sm text-sm font-medium text-blue-900 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Créer un compte
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankLogin;
