import { create } from "zustand";
import type { GenerationResult } from "@/lib/llm/types";

export interface Idea {
  id: string;
  content: string;
  category: string;
  tags: string[];
  status: "new" | "draft" | "generated" | "posted";
  createdAt: string;
  updatedAt: string;
}

export interface Draft {
  id: string;
  ideaId: string;
  content: string;
  hashtags: string[];
  coaching: GenerationResult["coaching"];
  scores: GenerationResult["scores"];
  provider: string;
  model: string;
  createdAt: string;
}

interface AppState {
  // Ideas
  ideas: Idea[];
  setIdeas: (ideas: Idea[]) => void;
  addIdea: (idea: Idea) => void;
  removeIdea: (id: string) => void;
  updateIdea: (id: string, updates: Partial<Idea>) => void;

  // Drafts
  drafts: Draft[];
  setDrafts: (drafts: Draft[]) => void;
  addDraft: (draft: Draft) => void;
  clearDrafts: () => void;

  // Generation state
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;

  // Selection
  selectedIdeaId: string | null;
  setSelectedIdeaId: (id: string | null) => void;

  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Ideas
  ideas: [],
  setIdeas: (ideas) => set({ ideas }),
  addIdea: (idea) => set((state) => ({ ideas: [...state.ideas, idea] })),
  removeIdea: (id) =>
    set((state) => ({ ideas: state.ideas.filter((i) => i.id !== id) })),
  updateIdea: (id, updates) =>
    set((state) => ({
      ideas: state.ideas.map((i) => (i.id === id ? { ...i, ...updates } : i)),
    })),

  // Drafts
  drafts: [],
  setDrafts: (drafts) => set({ drafts }),
  addDraft: (draft) => set((state) => ({ drafts: [...state.drafts, draft] })),
  clearDrafts: () => set({ drafts: [] }),

  // Generation state
  isGenerating: false,
  setIsGenerating: (isGenerating) => set({ isGenerating }),

  // Selection
  selectedIdeaId: null,
  setSelectedIdeaId: (id) => set({ selectedIdeaId: id }),

  // Navigation
  activeTab: "ideas",
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
