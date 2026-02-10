import { create } from 'zustand';

const useStore = create((set, get) => ({
  // === ネタ帳 (Idea Book) ===
  ideas: [
    {
      id: '1',
      text: 'AIツールの使い分け方法まとめ',
      tags: ['AI', 'テック'],
      color: 'blue',
      pinned: true,
      createdAt: new Date('2025-01-15').toISOString(),
    },
    {
      id: '2',
      text: '朝活を3ヶ月続けた結果',
      tags: ['ライフスタイル', '習慣'],
      color: 'green',
      pinned: false,
      createdAt: new Date('2025-01-14').toISOString(),
    },
    {
      id: '3',
      text: 'フリーランスの確定申告で失敗した話',
      tags: ['フリーランス', 'お金'],
      color: 'yellow',
      pinned: false,
      createdAt: new Date('2025-01-13').toISOString(),
    },
    {
      id: '4',
      text: 'プログラミング初心者が最初に学ぶべき言語論争に終止符を打つ',
      tags: ['プログラミング', '初心者'],
      color: 'purple',
      pinned: true,
      createdAt: new Date('2025-01-12').toISOString(),
    },
    {
      id: '5',
      text: 'リモートワークで生産性が3倍になった環境構築',
      tags: ['リモートワーク', '生産性'],
      color: 'pink',
      pinned: false,
      createdAt: new Date('2025-01-11').toISOString(),
    },
  ],

  addIdea: (idea) =>
    set((state) => ({
      ideas: [
        {
          id: Date.now().toString(),
          text: idea.text,
          tags: idea.tags || [],
          color: idea.color || 'blue',
          pinned: false,
          createdAt: new Date().toISOString(),
        },
        ...state.ideas,
      ],
    })),

  updateIdea: (id, updates) =>
    set((state) => ({
      ideas: state.ideas.map((idea) => (idea.id === id ? { ...idea, ...updates } : idea)),
    })),

  deleteIdea: (id) =>
    set((state) => ({
      ideas: state.ideas.filter((idea) => idea.id !== id),
    })),

  togglePin: (id) =>
    set((state) => ({
      ideas: state.ideas.map((idea) => (idea.id === id ? { ...idea, pinned: !idea.pinned } : idea)),
    })),

  // === 生成画面 ===
  selectedIdea: null,
  selectedTone: 'kyoukan',
  selectedPostType: 'single',
  generatedPosts: {}, // { gemini: { text, status }, chatgpt: {...}, ... }
  isGenerating: false,

  setSelectedIdea: (idea) => set({ selectedIdea: idea }),
  setSelectedTone: (tone) => set({ selectedTone: tone }),
  setSelectedPostType: (type) => set({ selectedPostType: type }),

  setGenerating: (isGenerating) => set({ isGenerating }),

  setGeneratedPost: (llmId, data) =>
    set((state) => ({
      generatedPosts: {
        ...state.generatedPosts,
        [llmId]: data,
      },
    })),

  updateGeneratedPostText: (llmId, chunk) =>
    set((state) => ({
      generatedPosts: {
        ...state.generatedPosts,
        [llmId]: {
          ...state.generatedPosts[llmId],
          text: (state.generatedPosts[llmId]?.text || '') + chunk,
        },
      },
    })),

  clearGeneratedPosts: () => set({ generatedPosts: {} }),

  // === 選択したポスト（確認・編集用）===
  selectedPost: null,
  setSelectedPost: (post) => set({ selectedPost: post }),

  // === 炎上チェック結果 ===
  controversyResult: null,
  setControversyResult: (result) => set({ controversyResult: result }),

  // === フックバリエーション ===
  hookVariations: [],
  setHookVariations: (variations) => set({ hookVariations: variations }),

  // === A/Bテスト結果 ===
  abTestResults: [],
  setAbTestResults: (results) => set({ abTestResults: results }),

  // === 画面ナビゲーション ===
  currentView: 'ideabook', // 'ideabook' | 'generate' | 'edit' | 'history'
  setCurrentView: (view) => set({ currentView: view }),

  // === 履歴 ===
  history: [],
  addToHistory: (entry) =>
    set((state) => ({
      history: [
        {
          id: Date.now().toString(),
          ...entry,
          createdAt: new Date().toISOString(),
        },
        ...state.history,
      ],
    })),
}));

export default useStore;
