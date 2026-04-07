import { Bot, User, CheckCheck, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

interface MessageBubbleProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
  isNew?: boolean;
}

export default function MessageBubble({
  message,
  isUser,
  timestamp,
  isNew = false,
}: MessageBubbleProps) {
  const [displayedText, setDisplayedText] = useState(isUser || !isNew ? message : '');

  useEffect(() => {
    if (isUser || !isNew) {
      setDisplayedText(message);
      return;
    }

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= message.length) {
        setDisplayedText(message.slice(0, currentIndex));
        currentIndex += 2;
      } else {
        clearInterval(interval);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [message, isUser, isNew]);

  const formattedTime = timestamp.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex gap-3 mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-slideUp`}>
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md transition-transform hover:scale-110 ${isUser
            ? 'bg-gradient-to-br from-blue-500 to-blue-600'
            : 'bg-gradient-to-br from-[#0B3D91] to-[#35B8C6]'
          }`}
      >
        {isUser ? <User size={20} className="text-white" /> : <Bot size={20} className="text-white" />}
      </div>

      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[80%]`}>
        <div
          className={`rounded-3xl px-5 py-3 shadow-md transition-all hover:shadow-lg ${isUser
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-none'
              : 'bg-white text-slate-800 rounded-bl-none border border-slate-200 shadow-slate-100'
            }`}
        >
          {!isUser && isNew && displayedText.length < message.length && (
            <div className="absolute -top-2 -left-2 text-[#35B8C6] animate-pulse">
              <Sparkles size={16} />
            </div>
          )}
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap font-medium">{displayedText}</p>
        </div>

        <div className={`flex items-center gap-2 mt-2 px-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-xs text-gray-500">{formattedTime}</span>
          {isUser && <CheckCheck size={14} className="text-blue-500" />}
        </div>
      </div>
    </div>
  );
}
