import { User, Bot } from 'lucide-react';

interface MessageBubbleProps {
  message: string;
  isUser: boolean;
  timestamp?: Date;
  isNew?: boolean;
}

export default function MessageBubble({ message, isUser, timestamp, isNew }: MessageBubbleProps) {
  const timeStr = timestamp ? new Date(timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3 px-2 ${isNew ? 'animate-slideUp' : ''}`}>
      <div className={`flex max-w-[85%] sm:max-w-[75%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar Area */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
          isUser ? 'bg-gradient-to-br from-[#0055cc] to-[#00a8ff]' : 'bg-[#1a2a45] border border-white/10'
        }`}>
          {isUser ? <User size={14} color="#fff" /> : <Bot size={14} color="#00d4ff" />}
        </div>

        {/* Bubble Content */}
        <div className="flex flex-col">
          <div className={`px-4 py-3 rounded-2xl shadow-xl relative ${
            isUser 
              ? 'bg-gradient-to-br from-[#0055cc] to-[#00d4ff] text-white rounded-tr-none' 
              : 'bg-[#111e35]/80 backdrop-blur-md border border-white/10 text-[#f0f4ff] rounded-tl-none'
          }`}>
            <p className="text-[14px] leading-relaxed font-medium whitespace-pre-wrap">{message}</p>
            
            {/* Subtle glow for bot messages */}
            {!isUser && <div className="absolute inset-0 bg-[#00d4ff]/5 rounded-2xl pointer-events-none" />}
          </div>
          
          {/* Timestamp */}
          <div className={`text-[10px] mt-1.5 font-bold tracking-wider opacity-40 uppercase ${isUser ? 'text-right mr-1' : 'ml-1'}`}>
            {timeStr}
          </div>
        </div>
      </div>
    </div>
  );
}
