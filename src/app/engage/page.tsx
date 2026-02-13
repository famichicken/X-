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
} from "lucide-react";
import toast from "react-hot-toast";

// --- Types ---
interface WatchUser {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  addedAt: Date;
}

interface MockTweet {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  content: string;
  createdAt: Date;
  likes: number;
  retweets: number;
  replies: number;
  liked: boolean;
  retweeted: boolean;
}

// --- Demo data ---
const DEMO_USERS: WatchUser[] = [
  {
    id: "1",
    username: "elonmusk",
    displayName: "Elon Musk",
    avatarUrl: "",
    addedAt: new Date("2025-01-01"),
  },
  {
    id: "2",
    username: "OpenAI",
    displayName: "OpenAI",
    avatarUrl: "",
    addedAt: new Date("2025-01-15"),
  },
  {
    id: "3",
    username: "veraborja",
    displayName: "Vera Borja",
    avatarUrl: "",
    addedAt: new Date("2025-02-01"),
  },
];

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

  users.forEach((user, userIdx) => {
    for (let i = 0; i < 3; i++) {
      const idx = (userIdx * 3 + i) % contents.length;
      tweets.push({
        id: `tweet-${user.id}-${i}`,
        userId: user.id,
        username: user.username,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        content: contents[idx],
        createdAt: new Date(Date.now() - (userIdx * 3 + i) * 3600000),
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

// --- Avatar component ---
function UserAvatar({ username }: { username: string }) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-bold text-white">
      {username.charAt(0).toUpperCase()}
    </div>
  );
}

// --- Time format ---
function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}分前`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}時間前`;
  return `${Math.floor(hours / 24)}日前`;
}

// --- Number format ---
function formatNum(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}万`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

// --- AI Reply generator (mock) ---
function generateMockReply(content: string): string {
  const replies = [
    "素晴らしい視点ですね！完全に同意します。",
    "これは興味深い。もう少し詳しく教えていただけますか？",
    "まさにその通り！自分も同じことを考えていました。",
    "良い情報をありがとうございます！参考になります。",
    "共感します。一緒に頑張りましょう！",
  ];
  return replies[Math.abs(content.length) % replies.length];
}

// --- Main Page ---
export default function EngagePage() {
  const [watchUsers, setWatchUsers] = useState<WatchUser[]>(DEMO_USERS);
  const [tweets, setTweets] = useState<MockTweet[]>(() =>
    generateDemoTweets(DEMO_USERS)
  );
  const [newUsername, setNewUsername] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showWatchList, setShowWatchList] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [generatingReply, setGeneratingReply] = useState(false);

  // --- Add user ---
  const handleAddUser = useCallback(() => {
    const username = newUsername.replace("@", "").trim();
    if (!username) return;
    if (watchUsers.find((u) => u.username.toLowerCase() === username.toLowerCase())) {
      toast.error("既に登録されています");
      return;
    }
    const newUser: WatchUser = {
      id: `user-${Date.now()}`,
      username,
      displayName: `@${username}`,
      avatarUrl: "",
      addedAt: new Date(),
    };
    const updatedUsers = [...watchUsers, newUser];
    setWatchUsers(updatedUsers);
    setTweets(generateDemoTweets(updatedUsers));
    setNewUsername("");
    setShowAddForm(false);
    toast.success(`@${username} を追加しました`);
  }, [newUsername, watchUsers]);

  // --- Remove user ---
  const handleRemoveUser = useCallback(
    (userId: string) => {
      const updatedUsers = watchUsers.filter((u) => u.id !== userId);
      setWatchUsers(updatedUsers);
      setTweets(generateDemoTweets(updatedUsers));
      toast.success("ユーザーを削除しました");
    },
    [watchUsers]
  );

  // --- Like ---
  const handleLike = useCallback((tweetId: string) => {
    setTweets((prev) =>
      prev.map((t) =>
        t.id === tweetId
          ? { ...t, liked: !t.liked, likes: t.liked ? t.likes - 1 : t.likes + 1 }
          : t
      )
    );
  }, []);

  // --- Retweet ---
  const handleRetweet = useCallback((tweetId: string) => {
    setTweets((prev) =>
      prev.map((t) =>
        t.id === tweetId
          ? {
              ...t,
              retweeted: !t.retweeted,
              retweets: t.retweeted ? t.retweets - 1 : t.retweets + 1,
            }
          : t
      )
    );
  }, []);

  // --- AI Reply ---
  const handleGenerateReply = useCallback(
    (tweetId: string) => {
      const tweet = tweets.find((t) => t.id === tweetId);
      if (!tweet) return;
      setReplyingTo(tweetId);
      setGeneratingReply(true);
      setTimeout(() => {
        setReplyText(generateMockReply(tweet.content));
        setGeneratingReply(false);
      }, 800);
    },
    [tweets]
  );

  // --- Send Reply ---
  const handleSendReply = useCallback(() => {
    if (!replyText.trim()) return;
    toast.success("リプライを送信しました（デモ）");
    setReplyingTo(null);
    setReplyText("");
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
            variant="outline"
            size="sm"
            onClick={() => setShowWatchList(!showWatchList)}
          >
            <UserPlus className="mr-1 h-4 w-4" />
            {watchUsers.length}人
          </Button>
          <Button size="sm" onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="mr-1 h-4 w-4" />
            追加
          </Button>
        </div>
      </div>

      {/* Add user form */}
      {showAddForm && (
        <Card className="mb-4">
          <CardContent className="pt-4">
            <div className="flex gap-2">
              <Input
                placeholder="@ユーザー名を入力"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddUser()}
                className="flex-1"
              />
              <Button onClick={handleAddUser}>登録</Button>
              <Button variant="ghost" size="icon" onClick={() => setShowAddForm(false)}>
                <X className="h-4 w-4" />
              </Button>
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
                  {/* Like */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(tweet.id)}
                    className={`gap-1.5 ${
                      tweet.liked
                        ? "text-pink-500 hover:text-pink-600"
                        : "text-neutral-500 hover:text-pink-500"
                    }`}
                  >
                    <Heart
                      className={`h-4 w-4 ${tweet.liked ? "fill-current" : ""}`}
                    />
                    <span className="text-xs">{formatNum(tweet.likes)}</span>
                  </Button>

                  {/* Retweet */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRetweet(tweet.id)}
                    className={`gap-1.5 ${
                      tweet.retweeted
                        ? "text-green-500 hover:text-green-600"
                        : "text-neutral-500 hover:text-green-500"
                    }`}
                  >
                    <Repeat2 className="h-4 w-4" />
                    <span className="text-xs">{formatNum(tweet.retweets)}</span>
                  </Button>

                  {/* Comment (AI) */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleGenerateReply(tweet.id)}
                    className="gap-1.5 text-neutral-500 hover:text-blue-500"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-xs">{formatNum(tweet.replies)}</span>
                  </Button>

                  {/* AI generate badge */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleGenerateReply(tweet.id)}
                    className="ml-auto gap-1 text-purple-500 hover:text-purple-600"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span className="text-xs">AI返信</span>
                  </Button>
                </div>

                {/* Reply area */}
                {replyingTo === tweet.id && (
                  <div className="mt-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-700 dark:bg-neutral-900">
                    <div className="mb-2 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-purple-500" />
                      <span className="text-xs font-medium text-purple-600">
                        AI生成リプライ
                      </span>
                      {generatingReply && (
                        <Badge variant="secondary" className="text-xs">
                          生成中...
                        </Badge>
                      )}
                    </div>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="リプライを入力..."
                      rows={2}
                      className="mb-2 w-full resize-none rounded-md border border-neutral-200 bg-white p-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyText("");
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
                      <Button size="sm" onClick={handleSendReply}>
                        送信
                      </Button>
                    </div>
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
          現在はモックデータで表示しています。X API Basic プラン($100/月)を設定すると、
          実際のタイムライン取得・いいね・リポスト・リプライが有効になります。
        </p>
      </div>
    </div>
  );
}
