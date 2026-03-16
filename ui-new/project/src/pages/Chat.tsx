import { useState, useEffect, useRef } from 'react';
import { Send, CheckCircle, Zap, MessageCircle, TrendingUp, PlusCircle } from 'lucide-react';
import MessageBubble from '../components/MessageBubble';
import TypingIndicator from '../components/TypingIndicator';
import QuickActions from '../components/QuickActions';
import ChatStats from '../components/ChatStats';
import { askQuestion, getSessionHistory } from '../services/api';
import { clearSession, getSessionId } from '../utils/session';
import type { Message } from '../types';
import boaLogo from '../assets/boa-logo.png';

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(() => getSessionId());
  const [showStats, setShowStats] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadSessionHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    generateSuggestions();
  }, [messages]);

  const loadSessionHistory = async () => {
    try {
      const history = await getSessionHistory(sessionId);
      const loadedMessages: Message[] = [];

      history.forEach((conv) => {
        loadedMessages.push({
          id: `${conv.id}-q`,
          question: conv.question,
          answer: '',
          confidence: 0,
          timestamp: new Date(conv.created_at),
          isUser: true,
        });
        loadedMessages.push({
          id: `${conv.id}-a`,
          question: '',
          answer: conv.answer,
          confidence: conv.confidence,
          timestamp: new Date(conv.created_at),
          isUser: false,
        });
      });

      setMessages(loadedMessages);
    } catch (error) {
      console.error('Failed to load session history:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateSuggestions = () => {
    const botMessages = messages.filter(m => !m.isUser).slice(-3);
    const contextualSuggestions = [
      "Peux-tu expliquer plus ?",
      "Comment faire ?",
      "Quels sont les frais ?",
      "Temps de traitement ?",
    ];
    setSuggestions(contextualSuggestions.slice(0, 3));
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      question: inputValue,
      answer: '',
      confidence: 0,
      timestamp: new Date(),
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await askQuestion(inputValue, sessionId);

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        question: '',
        answer: response.answer,
        confidence: response.confidence,
        timestamp: new Date(),
        isUser: false,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        question: '',
        answer: "Désolé, une erreur s'est produite. Veuillez réessayer.",
        confidence: 0,
        timestamp: new Date(),
        isUser: false,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
    inputRef.current?.focus();
  };

  const handleSuggestion = (suggestion: string) => {
    setInputValue(suggestion);
    inputRef.current?.focus();
  };

  const handleNewChat = () => {
    clearSession();
    const newId = getSessionId();
    setSessionId(newId);
    setMessages([]);
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const botMessageCount = messages.filter(m => !m.isUser).length;
  const avgConfidence = messages.length > 0
    ? messages.filter(m => !m.isUser).reduce((sum, m) => sum + m.confidence, 0) / botMessageCount
    : 0;

  return (
    <div className="flex-1 flex flex-col h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <img
                src={boaLogo}
                alt="Bank of Africa"
                className="w-11 h-11 rounded-xl bg-white p-1 border border-[#0B3D91]/20 shadow-sm"
              />
              <div>
                <h2 className="text-xl font-bold text-gray-800">Assistant BOA</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-[#35B8C6] rounded-full animate-pulse" />
                  <span className="text-sm text-gray-600">En ligne – Réponses instantanées</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowStats(!showStats)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Afficher les statistiques"
            >
              <TrendingUp size={20} className="text-[#0B3D91]" />
            </button>
            <button
              onClick={handleNewChat}
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#0B3D91] border border-[#0B3D91]/30 rounded-lg hover:bg-blue-50 transition-colors"
              title="Démarrer une nouvelle conversation"
            >
              <PlusCircle size={16} />
              <span>Nouvelle conversation</span>
            </button>
          </div>
        </div>
      </div>

      {showStats && <ChatStats messageCount={botMessageCount} avgConfidence={avgConfidence} />}

      <div className="flex-1 overflow-y-auto px-6 py-6 scroll-smooth">
        {messages.length === 0 && (
          <QuickActions onSelectQuestion={handleQuickQuestion} />
        )}

        {messages.map((msg, index) => (
          <div key={msg.id} className="animate-fadeIn">
            <MessageBubble
              message={msg.isUser ? msg.question : msg.answer}
              isUser={msg.isUser}
              timestamp={msg.timestamp}
            />
            {!msg.isUser && index === messages.length - 1 && suggestions.length > 0 && (
              <div className="mt-3 ml-12 flex flex-wrap gap-2">
                {suggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestion(suggestion)}
                    className="px-3 py-1 text-xs bg-white border border-gray-300 text-gray-700 rounded-full hover:border-[#0B3D91] hover:text-[#0B3D91] transition-all hover:shadow-md"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isLoading && <TypingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white border-t border-gray-200 px-6 py-4 shadow-lg">
        <div className="flex gap-3 max-w-5xl mx-auto">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Posez votre question..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B3D91] focus:border-transparent transition-all shadow-sm"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="px-6 py-3 bg-gradient-to-r from-[#0B3D91] to-[#08306B] text-white rounded-lg hover:from-[#08306B] hover:to-[#041B3A] disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <Send size={20} />
            <span className="hidden sm:inline">Envoyer</span>
          </button>
        </div>
      </div>
    </div>
  );
}
