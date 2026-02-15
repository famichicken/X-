import { useState } from 'react';
import {
  Plus,
  Pin,
  PinOff,
  Trash2,
  Sparkles,
  Search,
  ArrowRight,
  ChevronUp,
  ChevronDown,
  Star,
} from 'lucide-react';
import useStore from '../store/useStore';

// テキストを「・」や「-」で分割する
function splitIdeasFromText(text) {
  // 改行で分割してから「・」「-」で始まる行をアイディアの区切りとして扱う
  const lines = text.split('\n');
  const ideas = [];
  let current = '';

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === '') continue;

    // 「・」「-」「−」「ー」で始まる行は新しいアイディアの開始
    if (/^[・\-\−ー]/.test(trimmed)) {
      if (current.trim()) {
        ideas.push(current.trim());
      }
      // 先頭の記号を除去
      current = trimmed.replace(/^[・\-\−ー]\s*/, '');
    } else {
      if (current) {
        current += '\n' + trimmed;
      } else {
        current = trimmed;
      }
    }
  }

  if (current.trim()) {
    ideas.push(current.trim());
  }

  return ideas;
}

export default function IdeaBook() {
  const {
    ideas,
    addIdea,
    addMultipleIdeas,
    deleteIdea,
    togglePin,
    setSelectedIdea,
    setCurrentView,
    movePriorityUp,
    movePriorityDown,
  } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newIdeaText, setNewIdeaText] = useState('');

  // フィルタリング
  const filteredIdeas = ideas.filter((idea) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return idea.text.toLowerCase().includes(q);
  });

  // アクティブ（ピン留め）とその他を分離
  const activeIdeas = filteredIdeas
    .filter((i) => i.pinned)
    .sort((a, b) => (b.priority || 0) - (a.priority || 0));
  const otherIdeas = filteredIdeas
    .filter((i) => !i.pinned)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handleAddIdea = () => {
    if (!newIdeaText.trim()) return;

    const splitIdeas = splitIdeasFromText(newIdeaText);

    if (splitIdeas.length > 1) {
      addMultipleIdeas(splitIdeas);
    } else {
      addIdea({ text: newIdeaText.trim() });
    }

    setNewIdeaText('');
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
            アイディアをストックして、いつでもAI生成
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          新しいアイディア
        </button>
      </div>

      {/* 検索バー */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="アイディアを検索..."
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
            placeholder={"アイディアを入力...\n\n複数のアイディアを一度に追加するには\n改行して「・」や「-」を先頭につけてください\n\n例:\n・AIツールの使い分け方法\n・朝活を3ヶ月続けた結果\n- フリーランスの確定申告の話"}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={5}
            autoFocus
          />
          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              「・」「-」で始まる行ごとに自動でアイディアを分割します
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewIdeaText('');
                }}
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
        </div>
      )}

      {/* アクティブアイディア（ピン留め）セクション */}
      {activeIdeas.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-medium text-yellow-400 flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 fill-yellow-400" />
            アクティブアイディア（優先順位順）
          </h3>
          <p className="text-xs text-gray-500 mb-3">
            スケジュール投稿時にこの順番でAI生成されます
          </p>
          <div className="space-y-2">
            {activeIdeas.map((idea, index) => (
              <ActiveIdeaItem
                key={idea.id}
                idea={idea}
                index={index}
                isFirst={index === 0}
                isLast={index === activeIdeas.length - 1}
                onDelete={() => deleteIdea(idea.id)}
                onTogglePin={() => togglePin(idea.id)}
                onSelect={() => handleSelectIdea(idea)}
                onMoveUp={() => movePriorityUp(idea.id)}
                onMoveDown={() => movePriorityDown(idea.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* アイデア一覧 */}
      <div>
        {activeIdeas.length > 0 && otherIdeas.length > 0 && (
          <h3 className="text-sm font-medium text-gray-400 mb-3">すべてのアイディア</h3>
        )}
        {otherIdeas.length === 0 && activeIdeas.length === 0 ? (
          <div className="text-center py-20">
            <Sparkles className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">ネタ帳は空です</p>
            <p className="text-gray-500 text-sm mt-1">「新しいアイディア」ボタンからアイディアを追加しましょう</p>
          </div>
        ) : (
          <div className="space-y-2">
            {otherIdeas.map((idea) => (
              <IdeaItem
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
    </div>
  );
}

function ActiveIdeaItem({ idea, index, isFirst, isLast, onDelete, onTogglePin, onSelect, onMoveUp, onMoveDown }) {
  return (
    <div
      className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg px-4 py-3 flex items-center gap-3 group"
    >
      <span className="text-sm font-bold text-yellow-400 w-6 text-center shrink-0">
        {index + 1}
      </span>
      <div className="flex flex-col gap-0.5 shrink-0">
        <button
          onClick={onMoveUp}
          disabled={isFirst}
          className="p-0.5 rounded hover:bg-gray-800/50 text-gray-500 hover:text-yellow-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onMoveDown}
          disabled={isLast}
          className="p-0.5 rounded hover:bg-gray-800/50 text-gray-500 hover:text-yellow-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>
      <Pin className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 shrink-0" />
      <p className="text-gray-100 text-sm flex-1">{idea.text}</p>
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={onTogglePin}
          className="p-1.5 rounded hover:bg-gray-800/50 text-gray-500 hover:text-gray-300 transition-colors"
          title="アクティブから外す"
        >
          <PinOff className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 rounded hover:bg-gray-800/50 text-gray-500 hover:text-red-400 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onSelect}
          className="p-1.5 rounded hover:bg-blue-600/30 text-gray-500 hover:text-blue-400 transition-colors"
          title="このアイディアで生成"
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function IdeaItem({ idea, onDelete, onTogglePin, onSelect }) {
  return (
    <div
      className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 card-hover group cursor-pointer flex items-center gap-3"
      onClick={onSelect}
    >
      <p className="text-gray-100 text-sm flex-1">{idea.text}</p>
      <span className="text-xs text-gray-500 shrink-0">
        {new Date(idea.createdAt).toLocaleDateString('ja-JP')}
      </span>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin();
          }}
          className="p-1.5 rounded hover:bg-gray-800/50 text-gray-500 hover:text-yellow-400 transition-colors"
          title="アクティブに追加"
        >
          <Pin className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1.5 rounded hover:bg-gray-800/50 text-gray-500 hover:text-red-400 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className="p-1.5 rounded hover:bg-blue-600/30 text-gray-500 hover:text-blue-400 transition-colors"
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
