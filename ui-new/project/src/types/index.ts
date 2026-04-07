export interface Message {
  id: string;
  question: string;
  answer: string;
  confidence: number;
  timestamp: Date;
  isUser?: boolean;
}

export interface Conversation {
  id: string;
  question: string;
  answer: string;
  confidence: number;
  created_at: string;
  session_id: string;
}

export interface AskResponse {
  answer: string;
  confidence: number;
  type?: string;
  intent?: string;
  emailStatus?: string;
  rpaStatus?: string;
}
