import { Twitter, Sparkles, BookOpen, History, Settings } from 'lucide-react';
import useStore from '../store/useStore';

const NAV_ITEMS = [
  { id: 'ideabook', label: 'ネタ帳', icon: BookOpen },
  { id: 'history', label: '履歴', icon: History },
  { id: 'settings', label: '設定', icon: Settings },
];

export default function Header() {
  const { currentView, setCurrentView } = useStore();

  return (
    <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Twitter className="w-6 h-6 text-blue-400" />
            <h1 className="text-lg font-bold text-white">
              X Post Master
            </h1>
            <span className="text-xs bg-blue-600/30 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30">
              β
            </span>
          </div>
        </div>

        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setCurrentView(id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentView === id
                  ? 'bg-blue-600/20 text-blue-400'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-gray-800 rounded-lg px-3 py-1.5 border border-gray-700">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-xs text-gray-300">Mock Mode</span>
          </div>
        </div>
      </div>
    </header>
  );
}
