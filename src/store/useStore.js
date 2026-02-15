import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({
      // === ネタ帳 (Idea Book) ===
      ideas: [],

      addIdea: (idea) =>
        set((state) => ({
          ideas: [
            {
              id: Date.now().toString(),
              text: idea.text,
              pinned: false,
              priority: 0,
              createdAt: new Date().toISOString(),
            },
            ...state.ideas,
          ],
        })),

      // 複数アイディアを一括追加（改行+「・」「-」で分割されたもの）
      addMultipleIdeas: (texts) =>
        set((state) => ({
          ideas: [
            ...texts.map((text, i) => ({
              id: (Date.now() + i).toString(),
              text: text.trim(),
              pinned: false,
              priority: 0,
              createdAt: new Date().toISOString(),
            })),
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

      // 優先順位の設定（アクティブアイディア用）
      setPriority: (id, priority) =>
        set((state) => ({
          ideas: state.ideas.map((idea) => (idea.id === id ? { ...idea, priority } : idea)),
        })),

      // 優先順位を上げる
      movePriorityUp: (id) =>
        set((state) => {
          const pinnedIdeas = state.ideas
            .filter((i) => i.pinned)
            .sort((a, b) => (b.priority || 0) - (a.priority || 0));
          const idx = pinnedIdeas.findIndex((i) => i.id === id);
          if (idx <= 0) return state;
          const currentPriority = pinnedIdeas[idx].priority || 0;
          const abovePriority = pinnedIdeas[idx - 1].priority || 0;
          return {
            ideas: state.ideas.map((idea) => {
              if (idea.id === id) return { ...idea, priority: abovePriority + 1 };
              return idea;
            }),
          };
        }),

      // 優先順位を下げる
      movePriorityDown: (id) =>
        set((state) => {
          const pinnedIdeas = state.ideas
            .filter((i) => i.pinned)
            .sort((a, b) => (b.priority || 0) - (a.priority || 0));
          const idx = pinnedIdeas.findIndex((i) => i.id === id);
          if (idx < 0 || idx >= pinnedIdeas.length - 1) return state;
          const belowPriority = pinnedIdeas[idx + 1].priority || 0;
          return {
            ideas: state.ideas.map((idea) => {
              if (idea.id === id) return { ...idea, priority: Math.max(0, belowPriority - 1) };
              return idea;
            }),
          };
        }),

      // === 生成画面 ===
      selectedIdea: null,
      selectedTone: 'kyoukan',
      selectedPostType: 'single',
      generatedPosts: {},
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
      currentView: 'ideabook',
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

      // === Xプロフィール設定 ===
      xProfile: {
        displayName: '',
        bio: '',
        samplePosts: '',
        targetAudience: '',
      },
      setXProfile: (profile) =>
        set((state) => ({
          xProfile: { ...state.xProfile, ...profile },
        })),

      // === スケジュール設定 ===
      scheduleSettings: {
        enabled: false,
        times: ['07:30', '12:00', '20:00'],
        autoGenerate: true,
        notificationsEnabled: false,
      },
      setScheduleSettings: (settings) =>
        set((state) => ({
          scheduleSettings: { ...state.scheduleSettings, ...settings },
        })),
      addScheduleTime: (time) =>
        set((state) => ({
          scheduleSettings: {
            ...state.scheduleSettings,
            times: [...state.scheduleSettings.times, time].sort(),
          },
        })),
      removeScheduleTime: (index) =>
        set((state) => ({
          scheduleSettings: {
            ...state.scheduleSettings,
            times: state.scheduleSettings.times.filter((_, i) => i !== index),
          },
        })),
    }),
    {
      name: 'x-post-master-storage',
      partialize: (state) => ({
        ideas: state.ideas,
        history: state.history,
        xProfile: state.xProfile,
        scheduleSettings: state.scheduleSettings,
        selectedTone: state.selectedTone,
        selectedPostType: state.selectedPostType,
      }),
    }
  )
);

export default useStore;
