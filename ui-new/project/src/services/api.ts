import type { AskResponse, Conversation } from '../types';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

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
