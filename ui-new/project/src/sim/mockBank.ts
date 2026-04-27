export type CardStatus = 'bloquee' | 'debloquee';
export type IntentCode = 'CARD_UNBLOCK' | 'GET_BALANCE' | 'DOTATION_ACTIVATE' | 'EXTERNAL_TRANSFER';
export type OperationStatus = 'SUCCESS' | 'FAILED';

export type AccountState = {
  accountRef: string;
  accountNumberMasked: string;
  cardStatus: CardStatus;
  balance: number;
  dotationEcommerce: boolean;
};

export type OperationLogEntry = {
  timestamp: string;
  intentCode: IntentCode;
  status: OperationStatus;
  details: string;
};

const STORAGE_ACCOUNT_PREFIX = 'mockbank:account:';
const STORAGE_LOGS_PREFIX = 'mockbank:logs:';

const seedAccounts: Record<string, AccountState> = {
  DEMO_ACC_001: {
    accountRef: 'DEMO_ACC_001',
    accountNumberMasked: '**** **** **** 1024',
    cardStatus: 'bloquee',
    balance: 125000,
    dotationEcommerce: false,
  },
};

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function loadAccount(accountRef: string): AccountState {
  const key = `${STORAGE_ACCOUNT_PREFIX}${accountRef}`;
  const stored = safeParse<AccountState>(localStorage.getItem(key));
  if (stored) return stored;
  const seeded = seedAccounts[accountRef] ?? {
    accountRef,
    accountNumberMasked: '**** **** **** 0000',
    cardStatus: 'bloquee',
    balance: 50000,
    dotationEcommerce: false,
  };
  localStorage.setItem(key, JSON.stringify(seeded));
  return seeded;
}

export function saveAccount(accountRef: string, account: AccountState) {
  localStorage.setItem(`${STORAGE_ACCOUNT_PREFIX}${accountRef}`, JSON.stringify(account));
}

export function loadLogs(accountRef: string): OperationLogEntry[] {
  return safeParse<OperationLogEntry[]>(localStorage.getItem(`${STORAGE_LOGS_PREFIX}${accountRef}`)) ?? [];
}

export function pushLog(accountRef: string, entry: OperationLogEntry) {
  const current = loadLogs(accountRef);
  current.unshift(entry);
  localStorage.setItem(`${STORAGE_LOGS_PREFIX}${accountRef}`, JSON.stringify(current.slice(0, 50)));
}

