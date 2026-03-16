interface QuickActionsProps {
  onSelectQuestion: (question: string) => void;
}

const quickQuestions = [
  "Comment ouvrir un compte ?",
  "Quels sont les horaires d'ouverture ?",
  "Comment contacter le service client ?",
  "Quels sont les frais bancaires ?",
  "Comment faire un virement ?",
  "Où trouver mon RIB ?",
];

export default function QuickActions({ onSelectQuestion }: QuickActionsProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-2xl p-6 mb-6">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Bienvenue sur l'Assistant BOA</h2>
        <p className="text-gray-600 text-sm">
          Je suis là pour répondre à vos questions. Choisissez une question rapide ou posez la vôtre :
        </p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {quickQuestions.map((question, index) => (
          <button
            key={index}
            onClick={() => onSelectQuestion(question)}
            className="px-4 py-2 bg-white border border-[#0B3D91]/20 text-[#0B3D91] rounded-full text-sm hover:bg-blue-50 hover:border-[#0B3D91]/30 transition-all shadow-sm hover:shadow"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}
