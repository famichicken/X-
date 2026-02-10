import { Clock, Copy, Check, Trash2, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import useStore from '../store/useStore';
import { LLM_CHARACTERS, POST_TONES } from '../constants/llmCharacters';

export default function HistoryScreen() {
  const { history, setSelectedIdea, setCurrentView, setSelectedPost } = useStore();
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReuse = (entry) => {
    setSelectedIdea({ id: Date.now().toString(), text: entry.idea, tags: [], color: 'blue', pinned: false, createdAt: new Date().toISOString() });
    setCurrentView('generate');
  };

  if (history.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <Clock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400 text-lg">履歴はまだありません</p>
        <p className="text-gray-500 text-sm mt-1">ポストを生成・採用すると、ここに履歴が表示されます</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Clock className="w-6 h-6 text-gray-400" />
          生成履歴
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          過去に生成・採用したポストの履歴
        </p>
      </div>

      <div className="space-y-3">
        {history.map((entry) => {
          const char = LLM_CHARACTERS[entry.llm];
          const tone = POST_TONES.find((t) => t.id === entry.tone);

          return (
            <div
              key={entry.id}
              className="bg-gray-900 border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {char && (
                    <>
                      <span className="text-sm">{char.avatar}</span>
                      <span className={`text-sm font-medium ${char.textClass}`}>{char.name}</span>
                    </>
                  )}
                  {tone && (
                    <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">
                      {tone.emoji} {tone.label}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(entry.createdAt).toLocaleString('ja-JP')}
                </span>
              </div>

              <div className="text-xs text-gray-500 mb-1.5">ネタ: {entry.idea}</div>

              <p className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed bg-gray-800/50 rounded-lg px-3 py-2 mb-3">
                {entry.text}
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(entry.text, entry.id)}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-200 transition-colors"
                >
                  {copiedId === entry.id ? (
                    <Check className="w-3.5 h-3.5 text-green-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  コピー
                </button>
                <button
                  onClick={() => handleReuse(entry)}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  このネタで再生成
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
