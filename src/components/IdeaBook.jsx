import { useState } from 'react';
import {
  Plus,
  Pin,
  PinOff,
  Trash2,
  Sparkles,
  Search,
  LayoutGrid,
  List,
  Tag,
  ArrowRight,
} from 'lucide-react';
import useStore from '../store/useStore';

const COLORS = [
  { id: 'blue', bg: 'bg-blue-500/10 border-blue-500/20', dot: 'bg-blue-400' },
  { id: 'green', bg: 'bg-emerald-500/10 border-emerald-500/20', dot: 'bg-emerald-400' },
  { id: 'yellow', bg: 'bg-yellow-500/10 border-yellow-500/20', dot: 'bg-yellow-400' },
  { id: 'purple', bg: 'bg-purple-500/10 border-purple-500/20', dot: 'bg-purple-400' },
  { id: 'pink', bg: 'bg-pink-500/10 border-pink-500/20', dot: 'bg-pink-400' },
  { id: 'gray', bg: 'bg-gray-500/10 border-gray-500/20', dot: 'bg-gray-400' },
];

function getColorClasses(colorId) {
  return COLORS.find((c) => c.id === colorId) || COLORS[0];
}

export default function IdeaBook() {
  const { ideas, addIdea, deleteIdea, togglePin, setSelectedIdea, setCurrentView } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [showAddForm, setShowAddForm] = useState(false);
  const [newIdeaText, setNewIdeaText] = useState('');
  const [newIdeaTags, setNewIdeaTags] = useState('');
  const [newIdeaColor, setNewIdeaColor] = useState('blue');

  // フィルタリング
  const filteredIdeas = ideas.filter((idea) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      idea.text.toLowerCase().includes(q) ||
      idea.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  // ピン留めを上に
  const sortedIdeas = [...filteredIdeas].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const handleAddIdea = () => {
    if (!newIdeaText.trim()) return;
    addIdea({
      text: newIdeaText.trim(),
      tags: newIdeaTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      color: newIdeaColor,
    });
    setNewIdeaText('');
    setNewIdeaTags('');
    setNewIdeaColor('blue');
    setShowAddForm(false);
  };

  const handleSelectIdea = (idea) => {
    setSelectedIdea(idea);
    setCurrentView('generate');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* ヘッダー部 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            📝 ネタ帳
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            投稿のアイデアをストックして、いつでもマルチ生成
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-gray-200 transition-colors border border-gray-700"
          >
            {viewMode === 'grid' ? <List className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            新しいネタ
          </button>
        </div>
      </div>

      {/* 検索バー */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="ネタを検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* 新規追加フォーム */}
      {showAddForm && (
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 mb-6">
          <textarea
            value={newIdeaText}
            onChange={(e) => setNewIdeaText(e.target.value)}
            placeholder="ネタ・アイデアを入力..."
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
            autoFocus
          />
          <div className="mt-3 flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={newIdeaTags}
                  onChange={(e) => setNewIdeaTags(e.target.value)}
                  placeholder="タグ（カンマ区切り）"
                  className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {COLORS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setNewIdeaColor(c.id)}
                  className={`w-5 h-5 rounded-full ${c.dot} ${
                    newIdeaColor === c.id ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900' : ''
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <button
              onClick={() => setShowAddForm(false)}
              className="bg-gray-800 hover:bg-gray-700 text-gray-200 font-medium px-4 py-2 rounded-lg transition-colors border border-gray-700 text-sm"
            >
              キャンセル
            </button>
            <button
              onClick={handleAddIdea}
              disabled={!newIdeaText.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm"
            >
              追加
            </button>
          </div>
        </div>
      )}

      {/* アイデア一覧 */}
      {sortedIdeas.length === 0 ? (
        <div className="text-center py-20">
          <Sparkles className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">ネタ帳は空です</p>
          <p className="text-gray-500 text-sm mt-1">「新しいネタ」ボタンからアイデアを追加しましょう</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedIdeas.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              onDelete={() => deleteIdea(idea.id)}
              onTogglePin={() => togglePin(idea.id)}
              onSelect={() => handleSelectIdea(idea)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {sortedIdeas.map((idea) => (
            <IdeaListItem
              key={idea.id}
              idea={idea}
              onDelete={() => deleteIdea(idea.id)}
              onTogglePin={() => togglePin(idea.id)}
              onSelect={() => handleSelectIdea(idea)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function IdeaCard({ idea, onDelete, onTogglePin, onSelect }) {
  const colorClasses = getColorClasses(idea.color);

  return (
    <div
      className={`${colorClasses.bg} border rounded-xl p-4 card-hover group cursor-pointer relative`}
      onClick={onSelect}
    >
      {idea.pinned && (
        <div className="absolute top-2 right-2">
          <Pin className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
        </div>
      )}

      <p className="text-gray-100 text-sm leading-relaxed mb-3 pr-6">{idea.text}</p>

      {idea.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {idea.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-gray-800/50 text-gray-400 px-2 py-0.5 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {new Date(idea.createdAt).toLocaleDateString('ja-JP')}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin();
            }}
            className="p-1.5 rounded-lg hover:bg-gray-800/50 text-gray-400 hover:text-yellow-400 transition-colors"
          >
            {idea.pinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1.5 rounded-lg hover:bg-gray-800/50 text-gray-400 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className="p-1.5 rounded-lg hover:bg-blue-600/30 text-gray-400 hover:text-blue-400 transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function IdeaListItem({ idea, onDelete, onTogglePin, onSelect }) {
  const colorClasses = getColorClasses(idea.color);

  return (
    <div
      className={`${colorClasses.bg} border rounded-lg px-4 py-3 card-hover group cursor-pointer flex items-center gap-3`}
      onClick={onSelect}
    >
      <div className={`w-2 h-2 rounded-full ${colorClasses.dot} shrink-0`} />
      {idea.pinned && <Pin className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 shrink-0" />}
      <p className="text-gray-100 text-sm flex-1 truncate">{idea.text}</p>
      <div className="flex items-center gap-1.5 shrink-0">
        {idea.tags.slice(0, 2).map((tag) => (
          <span key={tag} className="text-xs bg-gray-800/50 text-gray-400 px-2 py-0.5 rounded-full">
            #{tag}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin();
          }}
          className="p-1 rounded hover:bg-gray-800/50 text-gray-500 hover:text-yellow-400"
        >
          {idea.pinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1 rounded hover:bg-gray-800/50 text-gray-500 hover:text-red-400"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className="p-1 rounded hover:bg-blue-600/30 text-gray-500 hover:text-blue-400"
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
