"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/guest";
import * as store from "@/lib/local-store";
import type { ReferencePost } from "@/lib/local-store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Trash2,
  TrendingUp,
  BarChart3,
  FileText,
  Heart,
  Repeat2,
  MessageCircle,
  Eye,
  Bookmark,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import toast from "react-hot-toast";

function AnalysisSection({ posts }: { posts: ReferencePost[] }) {
  if (posts.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-neutral-500">
          バズポストを登録すると、ここにパターン分析が表示されます。
        </CardContent>
      </Card>
    );
  }

  const avgLength = Math.round(
    posts.reduce((sum, p) => sum + p.content.length, 0) / posts.length
  );
  const avgLikes = Math.round(
    posts.reduce((sum, p) => sum + p.likes, 0) / posts.length
  );
  const avgRetweets = Math.round(
    posts.reduce((sum, p) => sum + p.retweets, 0) / posts.length
  );
  const avgReplies = Math.round(
    posts.reduce((sum, p) => sum + p.replies, 0) / posts.length
  );
  const avgImpressions = Math.round(
    posts.reduce((sum, p) => sum + p.impressions, 0) / posts.length
  );

  // Engagement rate
  const avgEngRate =
    avgImpressions > 0
      ? (((avgLikes + avgRetweets + avgReplies) / avgImpressions) * 100).toFixed(2)
      : "N/A";

  // Character length distribution
  const shortPosts = posts.filter((p) => p.content.length <= 70).length;
  const medPosts = posts.filter(
    (p) => p.content.length > 70 && p.content.length <= 140
  ).length;
  const longPosts = posts.filter((p) => p.content.length > 140).length;

  // Common patterns
  const hasQuestion = posts.filter((p) => p.content.includes("？") || p.content.includes("?")).length;
  const hasEmoji = posts.filter((p) => /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u.test(p.content)).length;
  const hasNewlines = posts.filter((p) => p.content.includes("\n")).length;
  const hasHashtag = posts.filter((p) => p.content.includes("#")).length;

  // Best performing post
  const bestPost = [...posts].sort((a, b) => {
    const aScore = a.likes + a.retweets * 2 + a.replies * 3;
    const bScore = b.likes + b.retweets * 2 + b.replies * 3;
    return bScore - aScore;
  })[0];

  // Tag analysis
  const tagCounts: Record<string, number> = {};
  posts.forEach((p) => {
    if (p.tags) {
      p.tags.split(",").forEach((t) => {
        const tag = t.trim();
        if (tag) tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="h-4 w-4" />
            基本統計
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border p-3 text-center">
              <p className="text-2xl font-bold">{posts.length}</p>
              <p className="text-xs text-neutral-500">登録ポスト数</p>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <p className="text-2xl font-bold">{avgLength}</p>
              <p className="text-xs text-neutral-500">平均文字数</p>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <p className="text-2xl font-bold">{avgEngRate}%</p>
              <p className="text-xs text-neutral-500">平均エンゲージ率</p>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <p className="text-2xl font-bold">{avgLikes.toLocaleString()}</p>
              <p className="text-xs text-neutral-500">平均いいね</p>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <p className="text-2xl font-bold">{avgRetweets.toLocaleString()}</p>
              <p className="text-xs text-neutral-500">平均リポスト</p>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <p className="text-2xl font-bold">{avgReplies.toLocaleString()}</p>
              <p className="text-xs text-neutral-500">平均リプライ</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-4 w-4" />
            パターン分析
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Length distribution */}
          <div>
            <p className="mb-2 text-sm font-medium">文字数分布</p>
            <div className="flex gap-2">
              <div className="flex-1 rounded-lg bg-blue-50 p-2 text-center dark:bg-blue-950">
                <p className="text-lg font-bold">{shortPosts}</p>
                <p className="text-[10px] text-neutral-500">短文(~70字)</p>
              </div>
              <div className="flex-1 rounded-lg bg-green-50 p-2 text-center dark:bg-green-950">
                <p className="text-lg font-bold">{medPosts}</p>
                <p className="text-[10px] text-neutral-500">中文(71-140字)</p>
              </div>
              <div className="flex-1 rounded-lg bg-purple-50 p-2 text-center dark:bg-purple-950">
                <p className="text-lg font-bold">{longPosts}</p>
                <p className="text-[10px] text-neutral-500">長文(141字~)</p>
              </div>
            </div>
          </div>

          {/* Common features */}
          <div>
            <p className="mb-2 text-sm font-medium">よく使うテクニック</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant={hasQuestion > posts.length / 2 ? "default" : "secondary"}>
                問いかけ {hasQuestion}/{posts.length}
              </Badge>
              <Badge variant={hasEmoji > posts.length / 2 ? "default" : "secondary"}>
                絵文字 {hasEmoji}/{posts.length}
              </Badge>
              <Badge variant={hasNewlines > posts.length / 2 ? "default" : "secondary"}>
                改行 {hasNewlines}/{posts.length}
              </Badge>
              <Badge variant={hasHashtag > posts.length / 2 ? "default" : "secondary"}>
                ハッシュタグ {hasHashtag}/{posts.length}
              </Badge>
            </div>
          </div>

          {/* Top tags */}
          {topTags.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-medium">よくあるジャンル</p>
              <div className="flex flex-wrap gap-1.5">
                {topTags.map(([tag, count]) => (
                  <Badge key={tag} variant="outline">
                    {tag} ({count})
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Best performing post */}
      {bestPost && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4" />
              ベストパフォーマンス
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border bg-neutral-50 p-3 dark:bg-neutral-900">
              <p className="whitespace-pre-wrap text-sm">{bestPost.content}</p>
            </div>
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-neutral-500">
              <span className="flex items-center gap-1">
                <Heart className="h-3 w-3" /> {bestPost.likes.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <Repeat2 className="h-3 w-3" /> {bestPost.retweets.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" /> {bestPost.replies.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" /> {bestPost.impressions.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function PostCard({
  post,
  onDelete,
}: {
  post: ReferencePost;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between gap-2">
          <div
            className="min-w-0 flex-1 cursor-pointer"
            onClick={() => setExpanded(!expanded)}
          >
            <p
              className={`whitespace-pre-wrap text-sm ${expanded ? "" : "line-clamp-3"}`}
            >
              {post.content}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="shrink-0 text-neutral-400 hover:text-red-500"
            onClick={() => onDelete(post.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Metrics */}
        <div className="mt-3 flex flex-wrap gap-3 text-xs text-neutral-500">
          <span className="flex items-center gap-1">
            <Heart className="h-3 w-3" /> {post.likes.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Repeat2 className="h-3 w-3" /> {post.retweets.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-3 w-3" /> {post.replies.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" /> {post.impressions.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Bookmark className="h-3 w-3" /> {post.bookmarks.toLocaleString()}
          </span>
        </div>

        {/* Tags & memo */}
        {expanded && (
          <div className="mt-3 space-y-2 border-t pt-3">
            {post.tags && (
              <div className="flex flex-wrap gap-1">
                {post.tags.split(",").map((t) => (
                  <Badge key={t.trim()} variant="secondary" className="text-[10px]">
                    {t.trim()}
                  </Badge>
                ))}
              </div>
            )}
            {post.memo && (
              <p className="text-xs text-neutral-500">
                <span className="font-medium">メモ:</span> {post.memo}
              </p>
            )}
            <p className="text-[10px] text-neutral-400">
              投稿日: {post.postedAt ? new Date(post.postedAt).toLocaleDateString("ja-JP") : "不明"}
            </p>
          </div>
        )}

        <button
          className="mt-2 flex w-full items-center justify-center text-xs text-neutral-400"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
        </button>
      </CardContent>
    </Card>
  );
}

export default function ReferencePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [posts, setPosts] = useState<ReferencePost[]>([]);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [content, setContent] = useState("");
  const [likes, setLikes] = useState("");
  const [retweets, setRetweets] = useState("");
  const [replies, setReplies] = useState("");
  const [impressions, setImpressions] = useState("");
  const [bookmarks, setBookmarks] = useState("");
  const [postedAt, setPostedAt] = useState("");
  const [tags, setTags] = useState("");
  const [memo, setMemo] = useState("");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/");
      return;
    }
    setPosts(store.getReferencePosts());
  }, [isAuthenticated, isLoading, router]);

  const resetForm = () => {
    setContent("");
    setLikes("");
    setRetweets("");
    setReplies("");
    setImpressions("");
    setBookmarks("");
    setPostedAt("");
    setTags("");
    setMemo("");
  };

  const handleAdd = () => {
    if (!content.trim()) {
      toast.error("ポスト内容を入力してください");
      return;
    }

    store.addReferencePost({
      content: content.trim(),
      likes: parseInt(likes) || 0,
      retweets: parseInt(retweets) || 0,
      replies: parseInt(replies) || 0,
      impressions: parseInt(impressions) || 0,
      bookmarks: parseInt(bookmarks) || 0,
      postedAt: postedAt || new Date().toISOString(),
      tags: tags.trim(),
      memo: memo.trim(),
    });

    setPosts(store.getReferencePosts());
    resetForm();
    setShowForm(false);
    toast.success("バズポストを登録しました");
  };

  const handleDelete = (id: string) => {
    store.deleteReferencePost(id);
    setPosts(store.getReferencePosts());
    toast.success("削除しました");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-neutral-500">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-2xl font-bold">バズポスト分析</h1>
          <p className="text-neutral-500">
            過去のバズポストを登録して、成功パターンを分析。AI生成の参考にできます。
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-1.5 h-4 w-4" />
          登録
        </Button>
      </div>

      {/* Add form */}
      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-base">バズポストを登録</CardTitle>
            <CardDescription>
              過去にバズった投稿の内容とエンゲージメント数値を入力してください。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="ref-content">ポスト内容</Label>
              <Textarea
                id="ref-content"
                placeholder="過去のバズポストの本文を貼り付け..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="mt-1.5 min-h-[100px]"
              />
              <p className="mt-1 text-xs text-neutral-400">
                {content.length}文字
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              <div>
                <Label htmlFor="ref-likes">
                  <Heart className="mr-1 inline h-3 w-3" />
                  いいね
                </Label>
                <Input
                  id="ref-likes"
                  type="number"
                  placeholder="0"
                  value={likes}
                  onChange={(e) => setLikes(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="ref-retweets">
                  <Repeat2 className="mr-1 inline h-3 w-3" />
                  リポスト
                </Label>
                <Input
                  id="ref-retweets"
                  type="number"
                  placeholder="0"
                  value={retweets}
                  onChange={(e) => setRetweets(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="ref-replies">
                  <MessageCircle className="mr-1 inline h-3 w-3" />
                  リプライ
                </Label>
                <Input
                  id="ref-replies"
                  type="number"
                  placeholder="0"
                  value={replies}
                  onChange={(e) => setReplies(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="ref-impressions">
                  <Eye className="mr-1 inline h-3 w-3" />
                  表示
                </Label>
                <Input
                  id="ref-impressions"
                  type="number"
                  placeholder="0"
                  value={impressions}
                  onChange={(e) => setImpressions(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="ref-bookmarks">
                  <Bookmark className="mr-1 inline h-3 w-3" />
                  ブクマ
                </Label>
                <Input
                  id="ref-bookmarks"
                  type="number"
                  placeholder="0"
                  value={bookmarks}
                  onChange={(e) => setBookmarks(e.target.value)}
                  className="mt-1.5"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <Label htmlFor="ref-date">投稿日</Label>
                <Input
                  id="ref-date"
                  type="date"
                  value={postedAt}
                  onChange={(e) => setPostedAt(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="ref-tags">タグ（カンマ区切り）</Label>
                <Input
                  id="ref-tags"
                  placeholder="テック, AI, キャリア..."
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="mt-1.5"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="ref-memo">メモ（なぜバズったか）</Label>
              <Textarea
                id="ref-memo"
                placeholder="このポストがバズった理由を自分なりに分析..."
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="mt-1.5 min-h-[60px]"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAdd}>登録する</Button>
              <Button
                variant="outline"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
              >
                キャンセル
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Left - Post list */}
        <div>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <FileText className="h-5 w-5" />
            登録済みポスト ({posts.length})
          </h2>
          {posts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-neutral-500">
                まだバズポストが登録されていません。
                <br />
                「登録」ボタンから過去のバズポストを追加してください。
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>

        {/* Right - Analysis */}
        <div>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <BarChart3 className="h-5 w-5" />
            パターン分析
          </h2>
          <AnalysisSection posts={posts} />
        </div>
      </div>
    </div>
  );
}
