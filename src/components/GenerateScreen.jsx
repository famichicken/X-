import { useState, useCallback } from 'react';
import {
  ArrowLeft,
  Sparkles,
  Loader2,
  Copy,
  Check,
  RefreshCw,
  Shield,
  Zap,
  FlaskConical,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  MessageSquarePlus,
  Image,
  BarChart3,
} from 'lucide-react';
import useStore from '../store/useStore';
import { LLM_CHARACTERS, POST_TONES, POST_TYPES } from '../constants/llmCharacters';
import { generatePost, checkControversy, generateHookVariations, simulateABTest } from '../services/mockLlm';

const POST_TYPE_ICONS = {
  MessageSquare,
  MessageSquarePlus,
  Image,
  BarChart3,
};

export default function GenerateScreen() {
  const {
    selectedIdea,
    selectedTone,
    selectedPostType,
    setSelectedTone,
    setSelectedPostType,
    generatedPosts,
    isGenerating,
    setGenerating,
    setGeneratedPost,
    updateGeneratedPostText,
    clearGeneratedPosts,
    setCurrentView,
    setSelectedPost,
    controversyResult,
    setControversyResult,
    hookVariations,
    setHookVariations,
    abTestResults,
    setAbTestResults,
    addToHistory,
  } = useStore();

  const [copiedId, setCopiedId] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [checkingControversy, setCheckingControversy] = useState(null);
  const [generatingHooks, setGeneratingHooks] = useState(false);
  const [runningABTest, setRunningABTest] = useState(false);

  // 4つのLLMで同時生成
  const handleGenerate = useCallback(async () => {
    if (!selectedIdea) return;
    clearGeneratedPosts();
    setControversyResult(null);
    setHookVariations([]);
    setAbTestResults([]);
    setGenerating(true);

    const tone = POST_TONES.find((t) => t.id === selectedTone)?.label || '';

    // 各LLMの生成を並列実行
    const promises = Object.keys(LLM_CHARACTERS).map(async (llmId) => {
      setGeneratedPost(llmId, { text: '', status: 'generating' });

      try {
        await generatePost(llmId, selectedIdea.text, tone, {
          onChunk: (chunk) => updateGeneratedPostText(llmId, chunk),
          onComplete: (fullText) => {
            setGeneratedPost(llmId, { text: fullText, status: 'done' });
          },
        });
      } catch (err) {
        setGeneratedPost(llmId, { text: '', status: 'error', error: err.message });
      }
    });

    await Promise.all(promises);
    setGenerating(false);
  }, [selectedIdea, selectedTone]);

  // 個別LLM再生成
  const handleRegenerate = useCallback(async (llmId) => {
    if (!selectedIdea) return;
    const tone = POST_TONES.find((t) => t.id === selectedTone)?.label || '';

    setGeneratedPost(llmId, { text: '', status: 'generating' });

    try {
      await generatePost(llmId, selectedIdea.text, tone, {
        onChunk: (chunk) => updateGeneratedPostText(llmId, chunk),
        onComplete: (fullText) => {
          setGeneratedPost(llmId, { text: fullText, status: 'done' });
        },
      });
    } catch (err) {
      setGeneratedPost(llmId, { text: '', status: 'error', error: err.message });
    }
  }, [selectedIdea, selectedTone]);

  // コピー
  const handleCopy = (text, llmId) => {
    navigator.clipboard.writeText(text);
    setCopiedId(llmId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ポスト選択（編集画面へ）
  const handleSelectPost = (llmId, text) => {
    setSelectedPost({ llmId, text, tone: selectedTone, idea: selectedIdea });
    addToHistory({
      idea: selectedIdea.text,
      llm: llmId,
      text,
      tone: selectedTone,
      postType: selectedPostType,
    });
  };

  // 炎上チェック
  const handleControversyCheck = async (llmId, text) => {
    setCheckingControversy(llmId);
    const result = await checkControversy(text);
    setControversyResult({ llmId, ...result });
    setCheckingControversy(null);
  };

  // フックバリエーション生成
  const handleGenerateHooks = async () => {
    if (!selectedIdea) return;
    setGeneratingHooks(true);
    const variations = await generateHookVariations(selectedIdea.text, '');
    setHookVariations(variations);
    setGeneratingHooks(false);
  };

  // A/Bテスト
  const handleABTest = async () => {
    const posts = Object.values(generatedPosts)
      .filter((p) => p.status === 'done' && p.text)
      .map((p) => p.text);
    if (posts.length === 0) return;
    setRunningABTest(true);
    const results = await simulateABTest(posts);
    setAbTestResults(results);
    setRunningABTest(false);
  };

  if (!selectedIdea) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-400">ネタ帳からアイデアを選択してください</p>
        <button
          onClick={() => setCurrentView('ideabook')}
          className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-lg transition-colors"
        >
          ネタ帳に戻る
        </button>
      </div>
    );
  }

  const donePosts = Object.entries(generatedPosts).filter(
    ([, p]) => p.status === 'done' && p.text
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* 戻るボタン & お題表示 */}
      <div className="mb-6">
        <button
          onClick={() => setCurrentView('ideabook')}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">ネタ帳に戻る</span>
        </button>
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
          <div className="text-xs text-gray-500 mb-1">選択中のネタ</div>
          <p className="text-white text-lg font-medium">{selectedIdea.text}</p>
          {selectedIdea.tags?.length > 0 && (
            <div className="flex gap-1.5 mt-2">
              {selectedIdea.tags.map((tag) => (
                <span key={tag} className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 生成設定 */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          {/* テイスト選択 */}
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs text-gray-500 mb-1.5 block">テイスト</label>
            <div className="flex flex-wrap gap-1.5">
              {POST_TONES.map((tone) => (
                <button
                  key={tone.id}
                  onClick={() => setSelectedTone(tone.id)}
                  className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                    selectedTone === tone.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200 border border-gray-700'
                  }`}
                  title={tone.description}
                >
                  {tone.emoji} {tone.label}
                </button>
              ))}
            </div>
          </div>

          {/* ポストタイプ */}
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">タイプ</label>
            <div className="flex gap-1.5">
              {POST_TYPES.map((type) => {
                const Icon = POST_TYPE_ICONS[type.icon];
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedPostType(type.id)}
                    className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors ${
                      selectedPostType === type.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
                    }`}
                  >
                    {Icon && <Icon className="w-3.5 h-3.5" />}
                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 生成ボタン */}
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                4つのAIで同時生成
              </>
            )}
          </button>

          {donePosts.length > 0 && (
            <>
              <button
                onClick={handleGenerateHooks}
                disabled={generatingHooks}
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-200 font-medium px-4 py-2.5 rounded-lg transition-colors border border-gray-700 text-sm"
              >
                {generatingHooks ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4 text-yellow-400" />
                )}
                フック生成
              </button>
              <button
                onClick={handleABTest}
                disabled={runningABTest}
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-200 font-medium px-4 py-2.5 rounded-lg transition-colors border border-gray-700 text-sm"
              >
                {runningABTest ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <FlaskConical className="w-4 h-4 text-purple-400" />
                )}
                A/Bテスト
              </button>
            </>
          )}
        </div>
      </div>

      {/* 生成結果 - 4カラムグリッド */}
      {Object.keys(generatedPosts).length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {Object.entries(LLM_CHARACTERS).map(([llmId, char]) => {
            const post = generatedPosts[llmId];
            if (!post) return null;

            return (
              <div
                key={llmId}
                className={`${char.bgClass} border rounded-xl overflow-hidden`}
              >
                {/* LLMヘッダー */}
                <div className="px-4 py-2.5 border-b border-gray-700/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{char.avatar}</span>
                    <div>
                      <div className={`text-sm font-medium ${char.textClass}`}>{char.name}</div>
                      <div className="text-xs text-gray-500">{char.label}</div>
                    </div>
                  </div>
                  {post.status === 'generating' && (
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                  )}
                </div>

                {/* 生成テキスト */}
                <div className="p-4 min-h-[200px]">
                  {post.status === 'error' ? (
                    <p className="text-red-400 text-sm">エラー: {post.error}</p>
                  ) : (
                    <p className="text-gray-200 text-sm whitespace-pre-wrap leading-relaxed">
                      {post.text}
                      {post.status === 'generating' && (
                        <span className="inline-block w-1.5 h-4 bg-gray-400 ml-0.5 animate-pulse" />
                      )}
                    </p>
                  )}
                </div>

                {/* アクション */}
                {post.status === 'done' && post.text && (
                  <div className="px-4 py-2.5 border-t border-gray-700/50 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopy(post.text, llmId)}
                        className="p-1.5 rounded-lg hover:bg-gray-800/50 text-gray-400 hover:text-gray-200 transition-colors"
                        title="コピー"
                      >
                        {copiedId === llmId ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleRegenerate(llmId)}
                        className="p-1.5 rounded-lg hover:bg-gray-800/50 text-gray-400 hover:text-gray-200 transition-colors"
                        title="再生成"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleControversyCheck(llmId, post.text)}
                        className="p-1.5 rounded-lg hover:bg-gray-800/50 text-gray-400 hover:text-gray-200 transition-colors"
                        title="炎上チェック"
                      >
                        {checkingControversy === llmId ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Shield className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <button
                      onClick={() => handleSelectPost(llmId, post.text)}
                      className={`text-xs font-medium px-3 py-1 rounded-lg transition-colors ${char.bgClass} ${char.textClass} hover:opacity-80`}
                    >
                      これを採用
                    </button>
                  </div>
                )}

                {/* 炎上チェック結果 */}
                {controversyResult && controversyResult.llmId === llmId && (
                  <div
                    className={`px-4 py-2.5 border-t text-xs ${
                      controversyResult.level === 'danger'
                        ? 'bg-red-900/20 border-red-500/30 text-red-300'
                        : controversyResult.level === 'warning'
                        ? 'bg-yellow-900/20 border-yellow-500/30 text-yellow-300'
                        : 'bg-green-900/20 border-green-500/30 text-green-300'
                    }`}
                  >
                    <p>{controversyResult.message}</p>
                    {controversyResult.suggestions.length > 0 && (
                      <ul className="mt-1.5 space-y-0.5">
                        {controversyResult.suggestions.map((s, i) => (
                          <li key={i}>💡 {s}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* フックバリエーション */}
      {hookVariations.length > 0 && (
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 mb-6">
          <h3 className="text-sm font-medium text-yellow-400 flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4" />
            フック（1行目）バリエーション 10パターン
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {hookVariations.map((hook, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-gray-800/50 rounded-lg px-3 py-2 hover:bg-gray-800 transition-colors cursor-pointer group"
                onClick={() => handleCopy(hook.text, `hook-${i}`)}
              >
                <span className="text-xs text-gray-500 w-5 shrink-0">#{i + 1}</span>
                <p className="text-sm text-gray-200 flex-1">{hook.text}</p>
                <span className="text-xs text-gray-500 shrink-0">{hook.type}</span>
                {copiedId === `hook-${i}` ? (
                  <Check className="w-3.5 h-3.5 text-green-400 shrink-0" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* A/Bテスト結果 */}
      {abTestResults.length > 0 && (
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 mb-6">
          <h3 className="text-sm font-medium text-purple-400 flex items-center gap-2 mb-3">
            <FlaskConical className="w-4 h-4" />
            A/Bテスト（思考実験）結果
          </h3>
          <div className="space-y-3">
            {abTestResults.map((result, i) => {
              const llmIds = Object.keys(LLM_CHARACTERS);
              const llmId = llmIds[i];
              const char = llmId ? LLM_CHARACTERS[llmId] : null;

              return (
                <div key={i} className="bg-gray-800/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {char && <span className="text-sm">{char.avatar}</span>}
                      <span className="text-sm text-gray-300">パターン {i + 1}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">予測インプレッション:</span>
                      <span className="text-sm font-medium text-blue-400">{result.predictedImpressions}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mb-2 truncate">{result.text}</p>

                  {/* スコアバー */}
                  <div className="relative h-2 bg-gray-700 rounded-full mb-3 overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      style={{ width: `${result.overallScore}%` }}
                    />
                  </div>

                  {/* リアクション */}
                  <div className="grid grid-cols-3 gap-2">
                    {Object.values(result.reactions).map((reaction) => (
                      <div key={reaction.label} className="bg-gray-900/50 rounded-lg px-2 py-1.5 text-center">
                        <div className="text-sm mb-0.5">{reaction.emoji}</div>
                        <div className="text-xs text-gray-400">{reaction.label}</div>
                        <div className="text-sm font-medium text-gray-200">{reaction.score}点</div>
                        <div className="text-xs text-gray-500 mt-0.5">「{reaction.comment}」</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 選択中のポスト（プレビュー） */}
      {useStore.getState().selectedPost && (
        <SelectedPostPreview />
      )}
    </div>
  );
}

function SelectedPostPreview() {
  const { selectedPost, setSelectedPost } = useStore();
  const [editedText, setEditedText] = useState(selectedPost?.text || '');

  if (!selectedPost) return null;

  const char = LLM_CHARACTERS[selectedPost.llmId];
  const charCount = editedText.length;

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-white flex items-center gap-2">
          <Check className="w-4 h-4 text-green-400" />
          採用ポスト - {char?.name}で生成
        </h3>
        <button
          onClick={() => setSelectedPost(null)}
          className="text-xs text-gray-500 hover:text-gray-300"
        >
          閉じる
        </button>
      </div>

      <textarea
        value={editedText}
        onChange={(e) => setEditedText(e.target.value)}
        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        rows={8}
      />

      <div className="mt-2 flex items-center justify-between">
        <span className={`text-xs ${charCount > 280 ? 'text-red-400' : 'text-gray-500'}`}>
          {charCount} / 280文字
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleCopy(editedText, 'selected')}
            className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 px-3 py-1.5 rounded-lg transition-colors border border-gray-700 text-sm"
          >
            <Copy className="w-3.5 h-3.5" />
            コピー
          </button>
          <button className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-lg transition-colors text-sm font-medium">
            Xに投稿（準備中）
          </button>
        </div>
      </div>
    </div>
  );
}
