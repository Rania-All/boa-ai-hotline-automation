import { Heart, Frown, Meh } from 'lucide-react';

interface SentimentIndicatorProps {
  text: string;
}

export default function SentimentIndicator({ text }: SentimentIndicatorProps) {
  const analyzeSentiment = (str: string) => {
    const positive = ['oui', 'merci', 'excellent', 'bien', 'super', 'fantastique', 'génial', 'amour'];
    const negative = ['non', 'mauvais', 'erreur', 'problème', 'plainte', 'horrible', 'nul'];

    const lowerText = str.toLowerCase();
    const posCount = positive.filter(word => lowerText.includes(word)).length;
    const negCount = negative.filter(word => lowerText.includes(word)).length;

    if (posCount > negCount) return 'positive';
    if (negCount > posCount) return 'negative';
    return 'neutral';
  };

  const sentiment = analyzeSentiment(text);

  const config = {
    positive: {
      icon: Heart,
      color: 'text-green-500',
      bg: 'bg-green-50',
      label: 'Positif',
    },
    negative: {
      icon: Frown,
      color: 'text-red-500',
      bg: 'bg-red-50',
      label: 'Négatif',
    },
    neutral: {
      icon: Meh,
      color: 'text-yellow-500',
      bg: 'bg-yellow-50',
      label: 'Neutre',
    },
  };

  const { icon: Icon, color, bg, label } = config[sentiment];

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${bg} ${color}`}>
      <Icon size={14} />
      <span>{label}</span>
    </div>
  );
}
