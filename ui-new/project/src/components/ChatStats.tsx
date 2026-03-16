import { BarChart3, Target, Zap } from 'lucide-react';

interface ChatStatsProps {
  messageCount: number;
  avgConfidence: number;
}

export default function ChatStats({ messageCount, avgConfidence }: ChatStatsProps) {
  const confidencePercentage = Math.round(avgConfidence * 100);

  return (
    <div className="bg-gradient-to-r from-red-50 via-white to-orange-50 border-b border-red-100 px-6 py-4 shadow-sm animate-slideDown">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-red-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-2 bg-red-100 rounded-lg">
            <BarChart3 size={20} className="text-red-600" />
          </div>
          <div>
            <p className="text-xs text-gray-600 font-medium">Réponses</p>
            <p className="text-lg font-bold text-gray-800">{messageCount}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-red-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Target size={20} className="text-orange-600" />
          </div>
          <div>
            <p className="text-xs text-gray-600 font-medium">Confiance</p>
            <p className="text-lg font-bold text-gray-800">{confidencePercentage}%</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-red-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-2 bg-green-100 rounded-lg">
            <Zap size={20} className="text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-600 font-medium">Performance</p>
            <p className="text-lg font-bold text-gray-800">
              {confidencePercentage >= 80 ? 'Excellente' : confidencePercentage >= 60 ? 'Bonne' : 'Standard'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
