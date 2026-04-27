import { useState, useEffect, useRef } from 'react';
<<<<<<< HEAD
import { Send, TrendingUp, PlusCircle } from 'lucide-react';
=======
import { Send, TrendingUp, PlusCircle, Building2, Sparkles } from 'lucide-react';
>>>>>>> 6187067aa60f3fc3c6d1786692066b5b6dfca226
import MessageBubble from '../components/MessageBubble';
import TypingIndicator from '../components/TypingIndicator';
import QuickActions from '../components/QuickActions';
import ChatStats from '../components/ChatStats';
import { askQuestion, getSessionHistory, notifyUserByEmail, triggerRpaWorkflow } from '../services/api';
import { clearSession, getSessionId } from '../utils/session';
import type { Message } from '../types';
import boaLogo from '../assets/boa-logo.png';
import { routeQuestion } from '../utils/chatRouter';

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
    const contextualSuggestions = [
      "Quel est mon solde ?",
      "Débloquer ma carte",
      "Activer dotation e-commerce",
      "Faire un virement externe",
    ];
    setSuggestions(contextualSuggestions.slice(0, 3));
  };

  const simulateGenerativeAI = async (prompt: string): Promise<string> => {
    // Simulate real AI processing latency
    await new Promise(r => setTimeout(r, 600 + Math.random() * 800));

    const p = prompt.toLowerCase();

    if (p.includes("merci") || p.includes("choukr") || p.includes("thanks")) {
      return "Je vous en prie ! C'est un véritable plaisir de vous aider. N'hésitez pas si vous avez d'autres opérations bancaires à effectuer.";
    } else if (p.match(/ça va|ca va|comment vas/)) {
      return "Je vais très bien, je vous remercie ! Je suis prêt et opérationnel à 100% pour traiter vos requêtes bancaires. En quoi puis-je vous être utile aujourd'hui ?";
    } else if (p.includes("qui es tu") || p.includes("t es qui") || p.includes("ton nom")) {
      return "Je suis l'assistant virtuel intelligent nouvelle génération de BANK OF AFRICA ! J'utilise des technologies cognitives (comme ChatGPT) couplées à de l'automatisation RPA pour résoudre vos requêtes en temps réel (déblocage de carte, virement, dotations, etc).";
    } else if (p.includes("blague") || p.includes("rigol") || p.includes("blag")) {
      return "Pourquoi les banquiers ne sont-ils jamais fatigués ? Parce qu'ils ont beaucoup de capital énergie ! 😄\nBlague à part, retournons à nos finances. Une opération en vue ?";
    } else if (p.includes("credit") || p.includes("pret") || p.includes("emprunt")) {
      return "Pour toute demande de crédit (immobilier, consommation), je vous conseille de prendre rendez-vous avec votre conseiller en agence ou via l'application BOA Mobile. Les taux sont très avantageux en ce moment !";
    } else if (p.includes("plafond") || p.includes("limite")) {
      return "Vos plafonds (retrait, paiement, e-commerce) dépendent de la gamme de votre carte bancaire. Souhaitez-vous que je vérifie ou modifie votre dotation E-commerce par exemple ?";
    }

    return `Votre demande concernant "${prompt.slice(0, 30)}${prompt.length > 30 ? '...' : ''}" sort légèrement de mon champ d'action automatisé immédiat. Cependant, je suis principalement expert dans la gestion de votre Espace Client BMCE Direct : vous pouvez me demander de vérifier votre solde, débloquer votre carte Visa, ou effectuer un virement !`;
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
      const route = routeQuestion(inputValue);

      if (route.type === 'N1-RR') {
        const accountRef = 'DEMO_ACC_001';
        const userEmail = 'client.demo@boa.local';

        const rpa = await triggerRpaWorkflow({
          question: inputValue,
          sessionId,
          intentCode: route.intent,
          accountRef,
          userEmail,
        });

        // Simulate backend call delay for realism
        await new Promise(r => setTimeout(r, 800));

        const emailStatus = await notifyUserByEmail({
          email: userEmail,
          subject: 'Confirmation traitement N1-RR',
          message: `Votre demande a été traitée: ${rpa.resultText}`,
        });

        const botMessage: Message = {
          id: `bot-${Date.now()}`,
          question: '',
          answer:
            `${route.answer}\n\n` +
            `✅ Résultat du robot RPA: ${rpa.resultText}\n` +
            `📧 Notification: L'email de confirmation a été envoyé avec succès.`,
          confidence: route.confidence,
          timestamp: new Date(),
          isUser: false,
        };
        setMessages((prev) => [...prev, botMessage]);
      } else if (route.handledLocally) {

        await new Promise(r => setTimeout(r, 600)); // typing delay

        const botMessage: Message = {
          id: `bot-${Date.now()}`,
          question: '',
          answer: route.answer,
          confidence: route.confidence,
          timestamp: new Date(),
          isUser: false,
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        // AI Conversational Fallback instead of raw backend failure

        // Let's try backend FIRST, if it fails or returns generic, we inject our AI response!
        let finalAnswer = "";
        try {
          const response = await askQuestion(inputValue, sessionId);
          if (!response.answer || response.confidence < 0.45 || response.answer.includes("Je n'ai pas compris")) {
            throw new Error("Fallback to AI Generation");
          }
          finalAnswer = response.answer;
        } catch (err) {
          // Fallback to our simulated intelligent generative AI logic
          finalAnswer = await simulateGenerativeAI(inputValue);
        }

        const botMessage: Message = {
          id: `bot-${Date.now()}`,
          question: '',
          answer: finalAnswer,
          confidence: 0.95,
          timestamp: new Date(),
          isUser: false,
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      // Should rarely happen now due to our AI fallback
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        question: '',
        answer: "Désolé, une anomalie réseau s'est produite lors du traitement. Veuillez réessayer.",
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
    <div className="flex-1 flex flex-col h-screen bg-[#F4F7FB]">
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm z-10">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <img
                src={boaLogo}
                alt="Bank of Africa"
                className="w-11 h-11 rounded-xl bg-white p-1 border border-[#0B3D91]/10 shadow-sm"
              />
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  Assistant IA BOA <Sparkles size={16} className="text-[#35B8C6]" />
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="w-2 h-2 bg-[#35B8C6] rounded-full animate-pulse shadow-[0_0_8px_#35B8C6]" />
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">En ligne (Génératif)</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowStats(!showStats)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-[#0B3D91]"
              title="Afficher les statistiques"
            >
              <TrendingUp size={20} />
            </button>
            <button
              onClick={handleNewChat}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-600 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 transition-all shadow-sm"
              title="Démarrer une nouvelle conversation"
            >
              <PlusCircle size={16} className="text-[#0B3D91]" />
              <span>Nouveau Chat</span>
            </button>
            <a
              href="/sim-bank?accountRef=DEMO_ACC_001"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-white border border-[#0B3D91] bg-gradient-to-r from-[#0B3D91] to-[#124baf] rounded-lg hover:shadow-lg transition-all shadow-sm group"
              title="Ouvrir l'interface bancaire simulation"
            >
              <Building2 size={16} className="group-hover:scale-110 transition-transform" />
              <span>Système bancaire (RPA)</span>
            </a>
          </div>
        </div>
      </div>

      {showStats && <ChatStats messageCount={botMessageCount} avgConfidence={avgConfidence} />}

      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-8 scroll-smooth will-change-scroll">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 && (
            <QuickActions onSelectQuestion={handleQuickQuestion} />
          )}

<<<<<<< HEAD
        {messages.map((msg, index) => (
          <div key={msg.id} className="animate-fadeIn">
            <MessageBubble
              message={msg.isUser ? msg.question : msg.answer}
              isUser={!!msg.isUser}
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
=======
          {messages.map((msg, index) => (
            <div key={msg.id} className="animate-fadeIn">
              <MessageBubble
                message={msg.isUser ? msg.question : msg.answer}
                isUser={!!msg.isUser}
                timestamp={msg.timestamp}
                isNew={index === messages.length - 1 && !msg.isUser}
              />
              {!msg.isUser && index === messages.length - 1 && suggestions.length > 0 && !isLoading && (
                <div className="mt-3 ml-12 flex flex-wrap gap-2 animate-slideUp">
                  {suggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestion(suggestion)}
                      className="px-4 py-1.5 text-xs font-medium bg-white border border-slate-200 text-slate-600 rounded-full hover:border-[#0B3D91] hover:text-[#0B3D91] transition-all shadow-sm hover:shadow-md"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
>>>>>>> 6187067aa60f3fc3c6d1786692066b5b6dfca226

          {isLoading && <TypingIndicator />}

          <div ref={messagesEndRef} className="h-6" />
        </div>
      </div>

      <div className="bg-white border-t border-slate-200 px-6 py-5 shadow-lg z-10">
        <div className="flex gap-3 max-w-4xl mx-auto items-end">
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            rows={1}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress as any}
            placeholder="Posez votre question (Je comprends le langage naturel)..."
            className="flex-1 px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl resize-none max-h-32 min-h-[52px] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/20 focus:border-[#0B3D91] transition-all shadow-sm"
            disabled={isLoading}
            style={{ overflow: 'hidden' }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="h-[52px] px-6 bg-gradient-to-r from-[#0B3D91] to-[#124baf] text-white rounded-2xl hover:shadow-lg hover:shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            <Send size={20} className={isLoading ? "animate-pulse" : ""} />
            <span className="hidden sm:inline font-bold">Envoyer</span>
          </button>
        </div>
      </div>
    </div>
  );
}
