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
  role: 'user' | 'admin';
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
    const admin: BankUser = {
      id: 'admin-id',
      nom: 'Admin',
      prenom: 'System',
      telephone: '0600000000',
      genre: 'M',
      cin: 'ADMIN01',
      nationalite: 'Marocaine',
      email: 'admin@boa.ma',
      dateNaissance: '1990-01-01',
      numeroCompte: 'ADMIN001',
      motDePasse: 'admin123',
      solde: 0,
      role: 'admin',
      cartes: [],
      transactions: []
    };

    const rania: BankUser = {
      id: 'rania-id',
      nom: 'ALGUI',
      prenom: 'Rania',
      telephone: '0600000001',
      genre: 'F',
      cin: 'RANIA01',
      nationalite: 'Marocaine',
      email: 'raniaalgui4@gmail.com',
      dateNaissance: '2003-10-24',
      numeroCompte: '0111175501',
      motDePasse: '123456789',
      solde: 13099.01,
      role: 'user',
      cartes: [{
        numero: '4242 8888 7777 0101',
        bloquee: false,
        dotationEcommerce: false,
        dotationTouristique: false
      }],
      transactions: []
    };

    if (!data) {
      const initialUsers = [admin, rania];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialUsers));
      return initialUsers;
    }

    let users: BankUser[] = JSON.parse(data);
    
    // Cleanup old test accounts to keep the table clean
    users = users.filter((u, index, self) => 
      index === self.findIndex((t) => t.numeroCompte === u.numeroCompte)
    );

    let updated = false;
    // S'assurer que l'admin existe toujours
    const adminIndex = users.findIndex(u => u.numeroCompte === 'ADMIN001');
    if (adminIndex === -1) {
      users.unshift(admin);
      updated = true;
    } else {
      let needsUpdate = false;
      if (users[adminIndex].motDePasse !== 'admin123') {
        users[adminIndex].motDePasse = 'admin123';
        needsUpdate = true;
      }
      if (users[adminIndex].role !== 'admin') {
        users[adminIndex].role = 'admin';
        needsUpdate = true;
      }
      if (needsUpdate) updated = true;
    }

    // S'assurer que Rania existe toujours avec le bon mot de passe
    const raniaIndex = users.findIndex(u => u.numeroCompte === '0111175501');
    if (raniaIndex === -1) {
      users.push(rania);
      updated = true;
    } else {
      let needsUpdate = false;
      if (users[raniaIndex].email !== rania.email) {
        users[raniaIndex].email = rania.email;
        needsUpdate = true;
      }
      if (users[raniaIndex].motDePasse !== '123456789') {
        users[raniaIndex].motDePasse = '123456789';
        needsUpdate = true;
      }
      if (users[raniaIndex].role !== 'user') {
        users[raniaIndex].role = 'user';
        needsUpdate = true;
      }
      if (!users[raniaIndex].cartes || users[raniaIndex].cartes.length === 0) {
        users[raniaIndex].cartes = rania.cartes;
        needsUpdate = true;
      }
      if (needsUpdate) updated = true;
    }

    if (updated || users.length !== JSON.parse(data).length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }
    
    return users;
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
      solde: Math.floor(5000 + Math.random() * 20000),
      role: 'user',
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
  },

  setCardStatus: (numeroCompte: string, blocked: boolean): boolean => {
    const users = BankStorage.getUsers();
    const userIndex = users.findIndex(u => u.numeroCompte === numeroCompte);
    if (userIndex === -1 || users[userIndex].cartes.length === 0) return false;

    users[userIndex].cartes[0].bloquee = blocked;
    BankStorage.saveUsers(users);
    return true;
  },

  setDotationEcommerce: (numeroCompte: string, active: boolean): boolean => {
    const users = BankStorage.getUsers();
    const userIndex = users.findIndex(u => u.numeroCompte === numeroCompte);
    if (userIndex === -1 || users[userIndex].cartes.length === 0) return false;

    users[userIndex].cartes[0].dotationEcommerce = active;
    BankStorage.saveUsers(users);
    return true;
  },

  setDotationTouristique: (numeroCompte: string, active: boolean): boolean => {
    const users = BankStorage.getUsers();
    const userIndex = users.findIndex(u => u.numeroCompte === numeroCompte);
    if (userIndex === -1 || users[userIndex].cartes.length === 0) return false;

    users[userIndex].cartes[0].dotationTouristique = active;
    BankStorage.saveUsers(users);
    return true;
  }
};
