export function getSessionId(): string {
  let sessionId = localStorage.getItem('chatSessionId');

  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    localStorage.setItem('chatSessionId', sessionId);
  }

  return sessionId;
}

export function clearSession(): void {
  localStorage.removeItem('chatSessionId');
}
