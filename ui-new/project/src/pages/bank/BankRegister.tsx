import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BankStorage } from '../../utils/BankStorage';
import { Shield, UserPlus, ArrowLeft } from 'lucide-react';

const BankRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    genre: 'M',
    cin: '',
    nationalite: 'Marocaine',
    email: '',
    dateNaissance: '',
    motDePasse: ''
  });

  const [registeredUser, setRegisteredUser] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = BankStorage.register(formData as any);
    setRegisteredUser(newUser);
  };

  if (registeredUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-green-200 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Compte Créé avec Succès !</h2>
            <p className="text-gray-600 mb-6">Veuillez noter vos identifiants pour vous connecter :</p>
            
            <div className="bg-gray-50 p-4 rounded-md mb-6 border border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Numéro de Compte (Identifiant) :</p>
              <p className="text-xl font-mono font-bold text-blue-900">{registeredUser.numeroCompte}</p>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-1">Solde Initial (Simulé) :</p>
                <p className="text-lg font-semibold text-green-700">{registeredUser.solde} MAD</p>
              </div>
            </div>

            <button
              onClick={() => navigate('/bank/login')}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-900 hover:bg-blue-800"
            >
              Aller à la page de connexion
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate('/bank/login')}
            className="flex items-center text-blue-900 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-1" /> Retour
          </button>
          <div className="flex items-center space-x-2 text-blue-900">
            <UserPlus className="w-6 h-6" />
            <span className="text-xl font-bold">Inscription Client</span>
          </div>
        </div>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nom</label>
                <input type="text" name="nom" required value={formData.nom} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Prénom</label>
                <input type="text" name="prenom" required value={formData.prenom} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Genre</label>
                <select name="genre" value={formData.genre} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Date de Naissance</label>
                <input type="date" name="dateNaissance" required value={formData.dateNaissance} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">CIN / Passeport</label>
                <input type="text" name="cin" required value={formData.cin} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Nationalité</label>
                <input type="text" name="nationalite" required value={formData.nationalite} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Numéro de Téléphone</label>
                <input type="tel" name="telephone" required value={formData.telephone} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-700">Mot de passe pour l'accès web</label>
              <input type="password" name="motDePasse" required value={formData.motDePasse} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>

            <div className="pt-5">
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Générer mon compte bancaire
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BankRegister;
