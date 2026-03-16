import { Mic, Volume2, Download, Share2, Copy } from 'lucide-react';
import { useState } from 'react';

interface AdvancedFeaturesProps {
  lastAnswer?: string;
}

export default function AdvancedFeatures({ lastAnswer }: AdvancedFeaturesProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (lastAnswer) {
      navigator.clipboard.writeText(lastAnswer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExport = () => {
    const element = document.createElement('a');
    const file = new Blob([lastAnswer || ''], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'reponse-bot.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex gap-2 ml-12 mt-2">
      <button
        title="Écouter la réponse"
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
      >
        <Volume2 size={16} className="text-gray-400 group-hover:text-orange-600" />
      </button>

      <button
        title="Microphone"
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
      >
        <Mic size={16} className="text-gray-400 group-hover:text-red-600" />
      </button>

      <button
        onClick={handleCopy}
        title="Copier"
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
      >
        <Copy size={16} className={copied ? 'text-green-600' : 'text-gray-400 group-hover:text-blue-600'} />
      </button>

      <button
        onClick={handleExport}
        title="Télécharger"
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
      >
        <Download size={16} className="text-gray-400 group-hover:text-purple-600" />
      </button>

      <button
        title="Partager"
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
      >
        <Share2 size={16} className="text-gray-400 group-hover:text-green-600" />
      </button>
    </div>
  );
}
