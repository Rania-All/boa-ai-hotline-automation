import React, { useState, useEffect } from 'react';
import { BankStorage, BankUser } from '../../utils/BankStorage';
import { Send, CheckCircle, Smartphone, AlertCircle, Clock, Mail } from 'lucide-react';

// EmailJS Configuration (To be filled by the user)
const EMAILJS_SERVICE_ID = 'service_si4fhul';
const EMAILJS_TEMPLATE_ID = 'template_my0666o';
const EMAILJS_PUBLIC_KEY = 'Em0KkG5gc3kWRhUjQ';

const TransferPage = () => {
  const [user, setUser] = useState<BankUser | null>(null);
  const [destinataire, setDestinataire] = useState('');
  const [montant, setMontant] = useState('');
  const [motif, setMotif] = useState('');
  const [step, setStep] = useState<'input' | 'otp' | 'success'>('input');
  const [error, setError] = useState('');
  
  // OTP Logic
  const [otpCode, setOtpCode] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [smsMessage, setSmsMessage] = useState('');
  const [showSms, setShowSms] = useState(false);
  const [validUntil, setValidUntil] = useState('');

  useEffect(() => {
    loadUser();
  }, [step]);

  const loadUser = () => {
    const currentUserStr = localStorage.getItem('boa_bank_current_user');
    if (currentUserStr) {
      const parsedUser = JSON.parse(currentUserStr);
      setUser(BankStorage.getUserByCompte(parsedUser.numeroCompte) || null);
    }
  };

  if (!user) return <div className="p-8 text-center">Chargement...</div>;

  const sendEmail = async (otp: string, msg: string, targetEmail: string) => {
    if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
      console.log('EmailJS non configuré. Simulation de l\'envoi...');
      return;
    }

    try {
      const data = {
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        template_params: {
          email: targetEmail,
          passcode: otp,
          time: validUntil,
          message: msg,
          amount: montant,
          receiver: destinataire
        }
      };

      await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      console.log('Email envoyé avec succès !');
    } catch (error) {
      console.error('Erreur EmailJS:', error);
    }
  };

  const handleInitiateTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const amountNum = parseFloat(montant);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Montant invalide');
      return;
    }

    if (amountNum > user.solde) {
      setError('Solde insuffisant');
      return;
    }

    // Generate OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpCode(generatedOtp);

    // Get Receiver Name
    const receiver = BankStorage.getUserByCompte(destinataire);
    const receiverName = receiver ? `${receiver.nom} ${receiver.prenom}` : 'DESTINATAIRE EXTERNE';
    
    // Calculate validity time (current time + 10 mins)
    const now = new Date();
    now.setMinutes(now.getMinutes() + 10);
    const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    setValidUntil(timeStr);

    // Format SMS/Email message
    const msg = `OPERATION SUR BMCE DIRECT DE ${montant} MAD AU PROFIT DE ${receiverName} COMPTE ${destinataire} CODE DE CONFIRMATION ${generatedOtp} UTILISABLE JUSQU'A ${timeStr}`;
    setSmsMessage(msg);
    
    // Trigger real Email send
    sendEmail(generatedOtp, msg, user.email);

    // Show step and "SMS" (Mockup visual)
    setStep('otp');
    setShowSms(true);
    // Hide SMS toast after 10 seconds
    setTimeout(() => setShowSms(false), 10000);
  };

  const handleConfirmOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otpInput !== otpCode) {
      setError('Code de confirmation incorrect');
      return;
    }

    const result = BankStorage.effectuerVirement(user.numeroCompte, destinataire, parseFloat(montant), motif);
    if (result) {
      setStep('success');
      setDestinataire('');
      setMontant('');
      setMotif('');
      setOtpInput('');
      setShowSms(false);
    } else {
      setError('Erreur lors du virement');
    }
  };

  const reset = () => {
    setStep('input');
    setError('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 relative">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Send className="w-6 h-6 mr-3 text-[#0B3D91]" />
          Transférer de l'argent
        </h2>

        {step === 'success' ? (
          <div className="text-center py-10 space-y-4">
            <div className="flex justify-center">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle className="w-16 h-16 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Virement Terminé !</h3>
            <p className="text-gray-600">Votre transfert a été traité avec succès.</p>
            <button
              onClick={reset}
              className="mt-6 px-8 py-3 bg-[#0B3D91] text-white rounded-xl hover:bg-[#08306B] transition-all font-bold"
            >
              Nouveau virement
            </button>
          </div>
        ) : (
          <>
            <div className="bg-[#0B3D91]/5 p-5 rounded-2xl mb-8 border border-[#0B3D91]/10 flex justify-between items-center">
              <div>
                <p className="text-xs text-[#0B3D91] font-bold uppercase tracking-wider mb-1">Votre Solde Actuel</p>
                <p className="text-3xl font-black text-[#0B3D91] tracking-tighter">
                  {user.solde.toLocaleString('fr-MA')} <span className="text-lg">MAD</span>
                </p>
              </div>
              <Clock className="text-[#0B3D91]/20 w-12 h-12" />
            </div>

            {error && (
              <div className="bg-red-50 p-4 rounded-xl mb-6 border border-red-200 text-red-800 flex items-center gap-3">
                <AlertCircle size={20} />
                <span className="font-medium text-sm">{error}</span>
              </div>
            )}

            {step === 'input' ? (
              <form onSubmit={handleInitiateTransfer} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Compte du bénéficiaire</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 011XXXXXXX"
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0B3D91] focus:border-transparent transition-all outline-none"
                    value={destinataire}
                    onChange={(e) => setDestinataire(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Montant à transférer (MAD)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0B3D91] focus:border-transparent transition-all outline-none text-2xl font-bold"
                    value={montant}
                    onChange={(e) => setMontant(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Motif du virement</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Loyer Avril"
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0B3D91] focus:border-transparent transition-all outline-none"
                    value={motif}
                    onChange={(e) => setMotif(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-[#0B3D91] to-[#08306B] text-white font-black text-lg rounded-xl hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all mt-4 uppercase tracking-widest shadow-blue-900/20 shadow-lg"
                >
                  Continuer
                </button>
              </form>
            ) : (
              <form onSubmit={handleConfirmOtp} className="space-y-6 animate-fadeIn">
                <div className="text-center p-6 bg-blue-50 rounded-2xl border border-blue-100">
                  <div className="flex justify-center mb-4">
                    <Mail size={48} className="text-[#0B3D91]" />
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg">Vérification par Email</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    Un code de confirmation a été envoyé à votre adresse email : <br/>
                    <span className="font-bold text-[#0B3D91]">{user.email}</span>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 text-center uppercase tracking-widest">Entrez le code de sécurité</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="000000"
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-dashed border-[#0B3D91]/30 rounded-xl focus:border-[#0B3D91] text-center text-4xl font-black tracking-[0.5em] transition-all outline-none"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep('input')}
                    className="flex-1 py-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all"
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] py-4 bg-[#35B8C6] text-white font-black text-lg rounded-xl hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
                  >
                    Confirmer le virement
                  </button>
                </div>
                <p className="text-center text-xs text-gray-400">
                  Le code expire à {validUntil}
                </p>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TransferPage;
