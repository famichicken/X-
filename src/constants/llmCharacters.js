// 4つのLLMキャラクター定義
// 各AIに個性的な「味」を持たせることで、多角的なポスト案を生成
export const LLM_CHARACTERS = {
  gemini: {
    id: 'gemini',
    name: 'Gemini',
    label: 'データ分析型',
    color: '#4285F4',
    bgClass: 'bg-blue-600/20 border-blue-500/30',
    textClass: 'text-blue-400',
    avatar: '💎',
    description: 'Google検索トレンドとデータに基づく分析的アプローチ',
    personality: 'データや統計を引用し、論理的で説得力のある投稿を作成。トレンドキーワードを自然に組み込む。',
  },
  chatgpt: {
    id: 'chatgpt',
    name: 'ChatGPT',
    label: 'バランス万能型',
    color: '#10A37F',
    bgClass: 'bg-emerald-600/20 border-emerald-500/30',
    textClass: 'text-emerald-400',
    avatar: '🤖',
    description: '読みやすく共感を得やすい万能なバランス型',
    personality: '親しみやすく読みやすい文章。幅広い層に刺さるバランスの取れた投稿を作成。',
  },
  claude: {
    id: 'claude',
    name: 'Claude',
    label: '構造・深掘り型',
    color: '#D97757',
    bgClass: 'bg-orange-600/20 border-orange-500/30',
    textClass: 'text-orange-400',
    avatar: '🧠',
    description: '深い考察と構造的な論理展開が得意',
    personality: '深い洞察と構造的な分析を行い、本質を突いた投稿を作成。知的好奇心を刺激する内容。',
  },
  grok: {
    id: 'grok',
    name: 'Grok',
    label: '皮肉・エッジ型',
    color: '#FF6B35',
    bgClass: 'bg-red-600/20 border-red-500/30',
    textClass: 'text-red-400',
    avatar: '🔥',
    description: 'X文化を熟知した皮肉とユーモアのエッジスタイル',
    personality: '皮肉やユーモアを効かせた鋭い投稿。Xのカルチャーを理解し、バズりやすいエッジの効いた表現。',
  },
};

// ポストのテイスト（トーン）
export const POST_TONES = [
  { id: 'oogiri', label: '大喜利', emoji: '😂', description: 'ウィットに富んだ面白い切り口' },
  { id: 'neta', label: 'ネタ', emoji: '🎭', description: 'エンタメ性の高い話題' },
  { id: 'aori', label: '煽り', emoji: '🔥', description: '議論を呼ぶ挑発的な切り口' },
  { id: 'hakushiki', label: '博識・教育', emoji: '📚', description: '知識や学びを提供' },
  { id: 'kyoukan', label: '共感', emoji: '💭', description: '共感を呼ぶ体験談・感情' },
  { id: 'senden', label: '宣伝', emoji: '📢', description: 'サービスや商品のプロモーション' },
  { id: 'aishuu', label: '哀愁', emoji: '🌙', description: 'しみじみとした余韻' },
];

// ポストタイプ
export const POST_TYPES = [
  { id: 'single', label: '単一ポスト', icon: 'MessageSquare' },
  { id: 'thread', label: 'スレッド', icon: 'MessageSquarePlus' },
  { id: 'with_image', label: '画像付き', icon: 'Image' },
  { id: 'with_poll', label: 'アンケート付き', icon: 'BarChart3' },
];
