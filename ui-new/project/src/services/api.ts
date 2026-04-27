import type { AskResponse, Conversation } from '../types';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';
const RPA_ORCHESTRATOR_URL = import.meta.env.VITE_RPA_ORCHESTRATOR_API || '';
const EMAIL_API_URL = import.meta.env.VITE_EMAIL_NOTIFICATION_API || '';

export async function askQuestion(question: string, sessionId: string): Promise<AskResponse> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question, sessionId }),
    });

    if (!response.ok) {
      throw new Error('Failed to get response from bot');
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error asking question:', error);
    throw error;
  }
}

export async function triggerRpaWorkflow(params: {
  question: string;
  sessionId: string;
  intentCode: string;
  accountRef: string;
  userEmail: string;
}): Promise<{ status: string; resultText: string; emailStatus: string }> {
  // Si un endpoint orchestrateur existe, on l'appelle.
  if (RPA_ORCHESTRATOR_URL) {
    const response = await fetch(RPA_ORCHESTRATOR_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requestId: crypto.randomUUID(),
        question: params.question,
        sessionId: params.sessionId,
        intentCode: params.intentCode,
        accountRef: params.accountRef,
        userEmail: params.userEmail,
      }),
    });

    if (!response.ok) throw new Error('RPA Orchestrator call failed');
    const data = await response.json();
    return {
      status: data.status ?? 'SUCCESS',
      resultText: data.resultText ?? 'Opération traitée via orchestrateur.',
      emailStatus: data.emailStatus ?? 'EMAIL_SENT',
    };
  }

  // Fallback démo local si l'orchestrateur n'est pas encore branché.
  await new Promise((resolve) => setTimeout(resolve, 1200));
  return {
    status: 'SUCCESS',
    resultText: 'Opération traitée via robot (mode simulation).',
    emailStatus: 'EMAIL_SENT_SIMULATED',
  };
}

export async function notifyUserByEmail(payload: {
  email: string;
  subject: string;
  message: string;
}): Promise<'EMAIL_SENT' | 'EMAIL_SENT_SIMULATED'> {
  if (EMAIL_API_URL) {
    const response = await fetch(EMAIL_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error('Email API failed');
    return 'EMAIL_SENT';
  }
  return 'EMAIL_SENT_SIMULATED';
}

export async function getHistory(): Promise<Conversation[]> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/admin/history`, { method: 'GET' });
    if (!response.ok) throw new Error('Failed to fetch history');
    return await response.json();
  } catch (error) {
    console.error('Error fetching history:', error);
    throw error;
  }
}

export async function getSessionHistory(sessionId: string): Promise<Conversation[]> {
  try {
    const url = new URL(`${BACKEND_URL}/api/admin/history`, window.location.origin);
    url.searchParams.set('sessionId', sessionId);
    const response = await fetch(url.toString(), { method: 'GET' });
    if (!response.ok) throw new Error('Failed to fetch session history');
    return await response.json();
  } catch (error) {
    console.error('Error fetching session history:', error);
    throw error;
  }
}

export async function clearHistory(): Promise<void> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/admin/history`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to clear history');
  } catch (error) {
    console.error('Error clearing history:', error);
    throw error;
  }
}
