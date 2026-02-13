"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Repeat2,
  MessageCircle,
  Plus,
  X,
  UserPlus,
  Sparkles,
  ExternalLink,
  Clock,
  Trash2,
  Search,
  User,
  Settings2,
  ChevronDown,
  ChevronUp,
  Send,
} from "lucide-react";
import toast from "react-hot-toast";

// --- Types ---
interface WatchUser {
  id: string;
  username: string;
  displayName: string;
  addedAt: Date;
}

interface MockTweet {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  content: string;
  createdAt: Date;
  likes: number;
  retweets: number;
  replies: number;
  liked: boolean;
  retweeted: boolean;
}

interface MyProfile {
  username: string;
  displayName: string;
  bio: string;
  style: string;
  recentPosts: string[];
}

// --- Demo search results ---
const SEARCH_SUGGESTIONS: { username: string; displayName: string }[] = [
  { username: "elonmusk", displayName: "Elon Musk" },
  { username: "OpenAI", displayName: "OpenAI" },
  { username: "AnthropicAI", displayName: "Anthropic" },
  { username: "GoogleAI", displayName: "Google AI" },
  { username: "vercel", displayName: "Vercel" },
  { username: "nextjs", displayName: "Next.js" },
  { username: "tailwindcss", displayName: "Tailwind CSS" },
  { username: "github", displayName: "GitHub" },
  { username: "figma", displayName: "Figma" },
  { username: "linear", displayName: "Linear" },
];

// --- Demo data ---
const DEMO_USERS: WatchUser[] = [
  { id: "1", username: "elonmusk", displayName: "Elon Musk", addedAt: new Date("2025-01-01") },
  { id: "2", username: "OpenAI", displayName: "OpenAI", addedAt: new Date("2025-01-15") },
  { id: "3", username: "AnthropicAI", displayName: "Anthropic", addedAt: new Date("2025-02-01") },
];

const DEFAULT_PROFILE: MyProfile = {
  username: "",
  displayName: "",
  bio: "",
  style: "丁寧で知的、技術に詳しい。絵文字は控えめに使う。",
  recentPosts: [
    "今日もコード書いてる。新しいフレームワーク試すの楽しい。",
    "AIツールの進化がすごい。開発効率が明らかに上がってる。",
    "週末はカフェで読書。インプットの時間も大切。",
  ],
};

function generateDemoTweets(users: WatchUser[]): MockTweet[] {
  const tweets: MockTweet[] = [];
  const contents = [
    "AIの進化が止まらない。次の10年で世界は大きく変わる。",
    "新しいプロジェクトを発表します！詳細は来週。お楽しみに。",
    "今日のランチは最高だった。たまには自分へのご褒美も大事。",
    "プログラミング初心者へ：最初の100時間が一番つらい。でも超えたら世界が変わる。",
    "週末のイベント、参加者募集中！興味ある方はDMください。",
    "朝活始めて1ヶ月。生産性が2倍になった気がする。",
    "新機能のベータテスト開始。フィードバックお待ちしています！",
    "読書メモ：『思考の整理学』めちゃくちゃ良かった。おすすめ。",
    "今週のポッドキャスト更新しました。テーマは「未来の働き方」",
  ];
  users.forEach((user, ui) => {
    for (let i = 0; i < 3; i++) {
      const idx = (ui * 3 + i) % contents.length;
      tweets.push({
        id: `tweet-${user.id}-${i}`,
        userId: user.id,
        username: user.username,
        displayName: user.displayName,
        content: contents[idx],
        createdAt: new Date(Date.now() - (ui * 3 + i) * 3600000),
        likes: Math.floor(Math.random() * 5000),
        retweets: Math.floor(Math.random() * 1200),
        replies: Math.floor(Math.random() * 300),
        liked: false,
        retweeted: false,
      });
    }
  });
  return tweets.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

// --- AI Reply generator (mock, prompt-aware & profile-aware) ---
function generateMockReply(
  tweetContent: string,
  prompt: string,
  profile: MyProfile
): string {
  const styleNote = profile.style || "自然な口調";
  const baseContext = profile.recentPosts.length > 0
    ? `（自分の投稿スタイル: ${profile.recentPosts[0].slice(0, 30)}...風）`
    : "";

  if (prompt.includes("面白") || prompt.includes("ユーモア")) {
    return `笑 それめっちゃわかります！${tweetContent.slice(0, 15)}...って聞くだけでテンション上がりますね ${baseContext ? "🔥" : "😆"}`;
  }
  if (prompt.includes("専門") || prompt.includes("詳しく") || prompt.includes("技術")) {
    return `技術的な観点から見ると非常に興味深いですね。特に${tweetContent.slice(0, 20)}の部分は、今後の発展が楽しみです。もう少し具体的な実装について伺えますか？`;
  }
  if (prompt.includes("共感") || prompt.includes("応援")) {
    return `めちゃくちゃ共感します！自分も同じことを感じていて、${tweetContent.slice(0, 15)}って大事ですよね。応援してます！`;
  }
  if (prompt.includes("質問")) {
    return `すごく気になります！${tweetContent.slice(0, 15)}について、もう少し詳しく教えていただけませんか？特にきっかけが知りたいです。`;
  }

  // Default: profile-aware reply
  const defaults = [
    `${styleNote}な視点から：とても参考になります。${tweetContent.slice(0, 15)}は自分も実践してみたい。`,
    `いい話ですね。${tweetContent.slice(0, 15)}、自分も共感します。${baseContext}`,
    `なるほど。${tweetContent.slice(0, 20)}について、自分も考えていました。意見交換したいです。`,
  ];
  return defaults[Math.abs(tweetContent.length + prompt.length) % defaults.length];
}

// --- Sub components ---
function UserAvatar({ username }: { username: string }) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-bold text-white">
      {username.charAt(0).toUpperCase()}
    </div>
  );
}

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}分前`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}時間前`;
  return `${Math.floor(hours / 24)}日前`;
}

function formatNum(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}万`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

// --- Prompt presets ---
const PROMPT_PRESETS = [
  { label: "共感", value: "共感して応援する感じで返信して" },
  { label: "質問", value: "興味を持って質問する形で返信して" },
  { label: "専門的", value: "専門的・技術的な視点で返信して" },
  { label: "ユーモア", value: "面白くユーモアを交えて返信して" },
  { label: "短め", value: "短く簡潔に、一言で返信して" },
];

// =====================
// Main Page
// =====================
export default function EngagePage() {
  const [watchUsers, setWatchUsers] = useState<WatchUser[]>(DEMO_USERS);
  const [tweets, setTweets] = useState<MockTweet[]>(() => generateDemoTweets(DEMO_USERS));

  // Add user
  const [newUsername, setNewUsername] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchResults, setSearchResults] = useState<typeof SEARCH_SUGGESTIONS>([]);
  const [showWatchList, setShowWatchList] = useState(false);

  // Reply
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyPrompt, setReplyPrompt] = useState("");
  const [generatingReply, setGeneratingReply] = useState(false);

  // My profile
  const [myProfile, setMyProfile] = useState<MyProfile>(DEFAULT_PROFILE);
  const [showProfile, setShowProfile] = useState(false);

  // --- Search ---
  const handleSearch = useCallback((query: string) => {
    setNewUsername(query);
    const q = query.replace("@", "").toLowerCase().trim();
    if (q.length === 0) {
      setSearchResults([]);
      return;
    }
    const results = SEARCH_SUGGESTIONS.filter(
      (s) =>
        s.username.toLowerCase().includes(q) ||
        s.displayName.toLowerCase().includes(q)
    );
    setSearchResults(results);
  }, []);

  const handleSelectSearchResult = useCallback(
    (username: string, displayName: string) => {
      if (watchUsers.find((u) => u.username.toLowerCase() === username.toLowerCase())) {
        toast.error("既に登録されています");
        return;
      }
      const newUser: WatchUser = {
        id: `user-${Date.now()}`,
        username,
        displayName,
        addedAt: new Date(),
      };
      const updated = [...watchUsers, newUser];
      setWatchUsers(updated);
      setTweets(generateDemoTweets(updated));
      setNewUsername("");
      setSearchResults([]);
      setShowAddForm(false);
      toast.success(`@${username} を追加しました`);
    },
    [watchUsers]
  );

  const handleAddUser = useCallback(() => {
    const username = newUsername.replace("@", "").trim();
    if (!username) return;
    handleSelectSearchResult(username, `@${username}`);
  }, [newUsername, handleSelectSearchResult]);

  const handleRemoveUser = useCallback(
    (userId: string) => {
      const updated = watchUsers.filter((u) => u.id !== userId);
      setWatchUsers(updated);
      setTweets(generateDemoTweets(updated));
      toast.success("ユーザーを削除しました");
    },
    [watchUsers]
  );

  // --- Engagement ---
  const handleLike = useCallback((tweetId: string) => {
    setTweets((prev) =>
      prev.map((t) =>
        t.id === tweetId
          ? { ...t, liked: !t.liked, likes: t.liked ? t.likes - 1 : t.likes + 1 }
          : t
      )
    );
  }, []);

  const handleRetweet = useCallback((tweetId: string) => {
    setTweets((prev) =>
      prev.map((t) =>
        t.id === tweetId
          ? { ...t, retweeted: !t.retweeted, retweets: t.retweeted ? t.retweets - 1 : t.retweets + 1 }
          : t
      )
    );
  }, []);

  // --- AI Reply with prompt ---
  const handleGenerateReply = useCallback(
    (tweetId: string, prompt?: string) => {
      const tweet = tweets.find((t) => t.id === tweetId);
      if (!tweet) return;
      setReplyingTo(tweetId);
      setGeneratingReply(true);
      const usePrompt = prompt ?? replyPrompt;
      setTimeout(() => {
        setReplyText(generateMockReply(tweet.content, usePrompt, myProfile));
        setGeneratingReply(false);
      }, 800);
    },
    [tweets, replyPrompt, myProfile]
  );

  const handleSendReply = useCallback(() => {
    if (!replyText.trim()) return;
    toast.success("リプライを送信しました（デモ）");
    setReplyingTo(null);
    setReplyText("");
    setReplyPrompt("");
  }, [replyText]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            エンゲージ
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            ウォッチリストのタイムライン
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={showProfile ? "secondary" : "outline"}
            size="sm"
            onClick={() => setShowProfile(!showProfile)}
            title="自分のプロフィール設定"
          >
            <User className="h-4 w-4" />
          </Button>
          <Button
            variant={showWatchList ? "secondary" : "outline"}
            size="sm"
            onClick={() => setShowWatchList(!showWatchList)}
          >
            <UserPlus className="mr-1 h-4 w-4" />
            {watchUsers.length}
          </Button>
          <Button size="sm" onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="mr-1 h-4 w-4" />
            追加
          </Button>
        </div>
      </div>

      {/* My Profile / X Account Settings */}
      {showProfile && (
        <Card className="mb-4 border-blue-200 dark:border-blue-900">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings2 className="h-4 w-4" />
              自分のXアカウント設定
            </CardTitle>
            <p className="text-xs text-neutral-500">
              AI返信があなたのスタイルに合うように調整します
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600 dark:text-neutral-400">
                @ユーザー名
              </label>
              <Input
                placeholder="@your_username"
                value={myProfile.username}
                onChange={(e) =>
                  setMyProfile((p) => ({ ...p, username: e.target.value.replace("@", "") }))
                }
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600 dark:text-neutral-400">
                表示名
              </label>
              <Input
                placeholder="あなたの名前"
                value={myProfile.displayName}
                onChange={(e) => setMyProfile((p) => ({ ...p, displayName: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600 dark:text-neutral-400">
                自己紹介 / Bio
              </label>
              <textarea
                placeholder="Xのプロフィール文をコピペ"
                value={myProfile.bio}
                onChange={(e) => setMyProfile((p) => ({ ...p, bio: e.target.value }))}
                rows={2}
                className="w-full resize-none rounded-md border border-neutral-200 bg-white p-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600 dark:text-neutral-400">
                投稿スタイル（AIへの指示）
              </label>
              <textarea
                placeholder="例: 丁寧で知的、技術に詳しい。絵文字は控えめ。"
                value={myProfile.style}
                onChange={(e) => setMyProfile((p) => ({ ...p, style: e.target.value }))}
                rows={2}
                className="w-full resize-none rounded-md border border-neutral-200 bg-white p-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
              />
            </div>
            <div>
              <label className="mb-1 flex items-center justify-between text-xs font-medium text-neutral-600 dark:text-neutral-400">
                <span>最近の自分の投稿（参考用）</span>
                <Badge variant="secondary" className="text-[10px]">
                  X API連携で自動取得可能
                </Badge>
              </label>
              {myProfile.recentPosts.map((post, i) => (
                <div key={i} className="mt-1 flex gap-2">
                  <Input
                    value={post}
                    onChange={(e) => {
                      const posts = [...myProfile.recentPosts];
                      posts[i] = e.target.value;
                      setMyProfile((p) => ({ ...p, recentPosts: posts }));
                    }}
                    className="text-xs"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={() => {
                      const posts = myProfile.recentPosts.filter((_, idx) => idx !== i);
                      setMyProfile((p) => ({ ...p, recentPosts: posts }));
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 text-xs"
                onClick={() =>
                  setMyProfile((p) => ({
                    ...p,
                    recentPosts: [...p.recentPosts, ""],
                  }))
                }
              >
                <Plus className="mr-1 h-3 w-3" />
                投稿を追加
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add user form with search */}
      {showAddForm && (
        <Card className="mb-4">
          <CardContent className="pt-4">
            <div className="relative">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                  <Input
                    placeholder="@ユーザー名を検索"
                    value={newUsername}
                    onChange={(e) => handleSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddUser()}
                    className="pl-9"
                    autoFocus
                  />
                </div>
                <Button onClick={handleAddUser}>登録</Button>
                <Button variant="ghost" size="icon" onClick={() => { setShowAddForm(false); setSearchResults([]); }}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {/* Search results dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute left-0 right-12 z-10 mt-1 rounded-lg border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
                  {searchResults.map((r) => (
                    <button
                      key={r.username}
                      onClick={() => handleSelectSearchResult(r.username, r.displayName)}
                      className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 first:rounded-t-lg last:rounded-b-lg"
                    >
                      <UserAvatar username={r.username} />
                      <div>
                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          {r.displayName}
                        </p>
                        <p className="text-xs text-neutral-500">@{r.username}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              <p className="mt-2 text-xs text-neutral-400">
                X API連携時はリアルタイム検索が有効になります
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Watchlist panel */}
      {showWatchList && (
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">ウォッチリスト</CardTitle>
          </CardHeader>
          <CardContent>
            {watchUsers.length === 0 ? (
              <p className="py-4 text-center text-sm text-neutral-500">
                ユーザーが登録されていません
              </p>
            ) : (
              <div className="space-y-2">
                {watchUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between rounded-lg border border-neutral-200 p-3 dark:border-neutral-800"
                  >
                    <div className="flex items-center gap-3">
                      <UserAvatar username={user.username} />
                      <div>
                        <p className="font-medium text-neutral-900 dark:text-neutral-100">
                          {user.displayName}
                        </p>
                        <p className="text-sm text-neutral-500">@{user.username}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveUser(user.id)}
                      className="text-neutral-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Timeline */}
      {tweets.length === 0 ? (
        <div className="py-16 text-center">
          <UserPlus className="mx-auto mb-4 h-12 w-12 text-neutral-300" />
          <p className="text-lg font-medium text-neutral-600">
            ウォッチリストにユーザーを追加してください
          </p>
          <p className="mt-1 text-sm text-neutral-400">
            気になるユーザーの@ユーザー名を登録するとタイムラインが表示されます
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {tweets.map((tweet) => (
            <Card key={tweet.id} className="overflow-hidden">
              <CardContent className="p-4">
                {/* Tweet header */}
                <div className="mb-2 flex items-start gap-3">
                  <UserAvatar username={tweet.username} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-semibold text-neutral-900 dark:text-neutral-100">
                        {tweet.displayName}
                      </span>
                      <span className="shrink-0 text-sm text-neutral-500">
                        @{tweet.username}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-neutral-400">
                      <Clock className="h-3 w-3" />
                      {timeAgo(tweet.createdAt)}
                    </div>
                  </div>
                  <a
                    href={`https://x.com/${tweet.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-neutral-400 hover:text-blue-500"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>

                {/* Tweet content */}
                <p className="mb-3 whitespace-pre-wrap text-neutral-800 dark:text-neutral-200">
                  {tweet.content}
                </p>

                {/* Engagement buttons */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(tweet.id)}
                    className={`gap-1.5 ${tweet.liked ? "text-pink-500 hover:text-pink-600" : "text-neutral-500 hover:text-pink-500"}`}
                  >
                    <Heart className={`h-4 w-4 ${tweet.liked ? "fill-current" : ""}`} />
                    <span className="text-xs">{formatNum(tweet.likes)}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRetweet(tweet.id)}
                    className={`gap-1.5 ${tweet.retweeted ? "text-green-500 hover:text-green-600" : "text-neutral-500 hover:text-green-500"}`}
                  >
                    <Repeat2 className="h-4 w-4" />
                    <span className="text-xs">{formatNum(tweet.retweets)}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setReplyingTo(replyingTo === tweet.id ? null : tweet.id);
                      setReplyText("");
                      setReplyPrompt("");
                    }}
                    className={`gap-1.5 ${replyingTo === tweet.id ? "text-blue-500" : "text-neutral-500 hover:text-blue-500"}`}
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-xs">{formatNum(tweet.replies)}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setReplyingTo(tweet.id);
                      handleGenerateReply(tweet.id, "");
                    }}
                    className="ml-auto gap-1 text-purple-500 hover:text-purple-600"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span className="text-xs">AI返信</span>
                  </Button>
                </div>

                {/* Reply area with prompt input */}
                {replyingTo === tweet.id && (
                  <div className="mt-3 space-y-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-700 dark:bg-neutral-900">
                    {/* Prompt section */}
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-purple-600 dark:text-purple-400">
                        <Sparkles className="h-3.5 w-3.5" />
                        AIへの指示（プロンプト）
                      </label>
                      <textarea
                        value={replyPrompt}
                        onChange={(e) => setReplyPrompt(e.target.value)}
                        placeholder="例: 面白く返して / 専門的に / 共感して応援する感じで"
                        rows={2}
                        className="w-full resize-none rounded-md border border-purple-200 bg-white p-2 text-sm placeholder:text-neutral-400 dark:border-purple-800 dark:bg-neutral-800 dark:text-neutral-100"
                      />
                      {/* Preset chips */}
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {PROMPT_PRESETS.map((preset) => (
                          <button
                            key={preset.label}
                            onClick={() => {
                              setReplyPrompt(preset.value);
                              handleGenerateReply(tweet.id, preset.value);
                            }}
                            className="rounded-full border border-purple-200 bg-purple-50 px-2.5 py-0.5 text-xs text-purple-600 transition hover:bg-purple-100 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-400"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Profile context indicator */}
                    {myProfile.username && (
                      <div className="flex items-center gap-1.5 rounded bg-blue-50 px-2 py-1 dark:bg-blue-950">
                        <User className="h-3 w-3 text-blue-500" />
                        <span className="text-[10px] text-blue-600 dark:text-blue-400">
                          @{myProfile.username} のスタイルを参照中
                        </span>
                      </div>
                    )}

                    {/* Generate button */}
                    <Button
                      size="sm"
                      onClick={() => handleGenerateReply(tweet.id)}
                      disabled={generatingReply}
                      className="w-full gap-2 bg-purple-600 hover:bg-purple-700"
                    >
                      <Sparkles className="h-4 w-4" />
                      {generatingReply ? "生成中..." : "AI返信を生成"}
                    </Button>

                    {/* Generated reply */}
                    {replyText && (
                      <div>
                        <label className="mb-1 block text-xs font-medium text-neutral-600 dark:text-neutral-400">
                          生成されたリプライ（編集可能）
                        </label>
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          rows={3}
                          className="w-full resize-none rounded-md border border-neutral-200 bg-white p-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                        />
                        <div className="mt-2 flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyText("");
                              setReplyPrompt("");
                            }}
                          >
                            キャンセル
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleGenerateReply(tweet.id)}
                            className="text-purple-500"
                          >
                            <Sparkles className="mr-1 h-3 w-3" />
                            再生成
                          </Button>
                          <Button size="sm" onClick={handleSendReply} className="gap-1.5">
                            <Send className="h-3.5 w-3.5" />
                            送信
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* API notice */}
      <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950">
        <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
          デモモード
        </p>
        <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
          現在はモックデータで動作中。X API Basic ($100/月) を設定すると：
        </p>
        <ul className="mt-1 list-inside list-disc text-xs text-amber-600 dark:text-amber-400">
          <li>ユーザー検索がリアルタイムに</li>
          <li>実際のタイムライン取得</li>
          <li>いいね・リポスト・リプライが実行</li>
          <li>自分の投稿履歴を自動参照してAI返信生成</li>
        </ul>
      </div>
    </div>
  );
}
