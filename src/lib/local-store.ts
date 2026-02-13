// localStorage-based data store for static/guest mode

function getStore<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStore<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

// Ideas
export interface LocalIdea {
  id: string;
  content: string;
  category: string;
  tags: string;
  priority: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export function getIdeas(): LocalIdea[] {
  return getStore<LocalIdea[]>("xpg_ideas", []);
}

export function addIdea(idea: Omit<LocalIdea, "id" | "createdAt" | "updatedAt">): LocalIdea {
  const ideas = getIdeas();
  const newIdea: LocalIdea = {
    ...idea,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  ideas.unshift(newIdea);
  setStore("xpg_ideas", ideas);
  return newIdea;
}

export function updateIdea(id: string, data: Partial<LocalIdea>): LocalIdea | null {
  const ideas = getIdeas();
  const idx = ideas.findIndex((i) => i.id === id);
  if (idx === -1) return null;
  ideas[idx] = { ...ideas[idx], ...data, updatedAt: new Date().toISOString() };
  setStore("xpg_ideas", ideas);
  return ideas[idx];
}

export function deleteIdea(id: string): boolean {
  const ideas = getIdeas();
  const filtered = ideas.filter((i) => i.id !== id);
  if (filtered.length === ideas.length) return false;
  setStore("xpg_ideas", filtered);
  return true;
}

// History (posts)
export interface LocalPost {
  id: string;
  content: string;
  llmProvider: string;
  llmModel: string;
  qualityScore: number;
  engagementScore: number;
  status: string;
  coachingAdvice: string;
  xPostId: string | null;
  postedAt: string | null;
  scheduledAt: string | null;
  createdAt: string;
  likes: number;
  retweets: number;
  replies: number;
  impressions: number;
  bookmarks: number;
}

export function getPosts(): LocalPost[] {
  return getStore<LocalPost[]>("xpg_posts", []);
}

export function addPost(post: Omit<LocalPost, "id" | "createdAt" | "likes" | "retweets" | "replies" | "impressions" | "bookmarks">): LocalPost {
  const posts = getPosts();
  const newPost: LocalPost = {
    ...post,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    likes: 0,
    retweets: 0,
    replies: 0,
    impressions: 0,
    bookmarks: 0,
  };
  posts.unshift(newPost);
  setStore("xpg_posts", posts);
  return newPost;
}

export function deletePost(id: string): boolean {
  const posts = getPosts();
  const filtered = posts.filter((p) => p.id !== id);
  if (filtered.length === posts.length) return false;
  setStore("xpg_posts", filtered);
  return true;
}

// Reference Posts (バズポスト)
export interface ReferencePost {
  id: string;
  content: string;
  likes: number;
  retweets: number;
  replies: number;
  impressions: number;
  bookmarks: number;
  postedAt: string;
  tags: string;
  memo: string;
  createdAt: string;
}

export function getReferencePosts(): ReferencePost[] {
  return getStore<ReferencePost[]>("xpg_reference_posts", []);
}

export function addReferencePost(
  post: Omit<ReferencePost, "id" | "createdAt">
): ReferencePost {
  const posts = getReferencePosts();
  const newPost: ReferencePost = {
    ...post,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  posts.unshift(newPost);
  setStore("xpg_reference_posts", posts);
  return newPost;
}

export function updateReferencePost(
  id: string,
  data: Partial<ReferencePost>
): ReferencePost | null {
  const posts = getReferencePosts();
  const idx = posts.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  posts[idx] = { ...posts[idx], ...data };
  setStore("xpg_reference_posts", posts);
  return posts[idx];
}

export function deleteReferencePost(id: string): boolean {
  const posts = getReferencePosts();
  const filtered = posts.filter((p) => p.id !== id);
  if (filtered.length === posts.length) return false;
  setStore("xpg_reference_posts", filtered);
  return true;
}

// Settings
export interface LocalSettings {
  claudeApiKey: string;
  chatgptApiKey: string;
  geminiApiKey: string;
  grokApiKey: string;
  defaultLlm: string;
  defaultTone: string;
  hashtagCount: number;
  emojiLimit: number;
  brandVoice: string;
  ngWords: string;
}

const DEFAULT_SETTINGS: LocalSettings = {
  claudeApiKey: "",
  chatgptApiKey: "",
  geminiApiKey: "",
  grokApiKey: "",
  defaultLlm: "claude",
  defaultTone: "casual",
  hashtagCount: 3,
  emojiLimit: 2,
  brandVoice: "",
  ngWords: "",
};

export function getSettings(): LocalSettings {
  return getStore<LocalSettings>("xpg_settings", DEFAULT_SETTINGS);
}

export function saveSettings(settings: LocalSettings): void {
  setStore("xpg_settings", settings);
}
