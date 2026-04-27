export interface BankUser {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  genre: 'M' | 'F';
  cin: string;
  nationalite: string;
  email: string;
  dateNaissance: string;
  numeroCompte: string;
  motDePasse: string;
  solde: number;
  cartes: {
    numero: string;
    bloquee: boolean;
    dotationEcommerce: boolean;
    dotationTouristique: boolean;
  }[];
  transactions: {
    id: string;
    date: string;
    montant: number;
    type: 'DEBIT' | 'CREDIT';
    libelle: string;
  }[];
}

const STORAGE_KEY = 'boa_mock_bank_users';

export const BankStorage = {
  getUsers: (): BankUser[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveUsers: (users: BankUser[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  },

  getUserByCompte: (numeroCompte: string): BankUser | undefined => {
    return BankStorage.getUsers().find((u) => u.numeroCompte === numeroCompte);
  },

  register: (user: Omit<BankUser, 'id' | 'numeroCompte' | 'solde' | 'cartes' | 'transactions'>): BankUser => {
    const users = BankStorage.getUsers();
    
    // Generate a unique account number (e.g., 011 followed by 7 random digits)
    const numeroCompte = '011' + Math.floor(1000000 + Math.random() * 9000000).toString();
    
    // Generate a mock card number
    const cardNumber = '4242 **** **** ' + Math.floor(1000 + Math.random() * 9000).toString();

    const newUser: BankUser = {
      ...user,
      id: crypto.randomUUID(),
      numeroCompte,
      solde: Math.floor(5000 + Math.random() * 20000), // Random starting balance between 5000 and 25000
      cartes: [{
        numero: cardNumber,
        bloquee: false,
        dotationEcommerce: false,
        dotationTouristique: false
      }],
      transactions: [{
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        montant: 5000,
        type: 'CREDIT',
        libelle: 'Versement Initial'
      }]
    };

    users.push(newUser);
    BankStorage.saveUsers(users);
    return newUser;
  },

  updateUser: (updatedUser: BankUser) => {
    const users = BankStorage.getUsers();
    const index = users.findIndex((u) => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      BankStorage.saveUsers(users);
    }
  },

  effectuerVirement: (compteSource: string, compteDestinataire: string, montant: number, motif: string): boolean => {
    const users = BankStorage.getUsers();
    const sourceIndex = users.findIndex(u => u.numeroCompte === compteSource);
    
    if (sourceIndex === -1 || users[sourceIndex].solde < montant) {
      return false;
    }

    // Deduct from source
    users[sourceIndex].solde -= montant;
    users[sourceIndex].transactions.unshift({
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      montant: montant,
      type: 'DEBIT',
      libelle: `Virement émis : ${motif}`
    });

    // We can simulate adding to destination if it exists in our mock DB, but it's optional for the RPA mockup
    const destIndex = users.findIndex(u => u.numeroCompte === compteDestinataire);
    if (destIndex !== -1) {
      users[destIndex].solde += montant;
      users[destIndex].transactions.unshift({
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        montant: montant,
        type: 'CREDIT',
        libelle: `Virement reçu : ${motif}`
      });
    }

    BankStorage.saveUsers(users);
    return true;
  }
};
