"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Copy, Trash2, Check, BarChart3 } from "lucide-react";
import toast from "react-hot-toast";

interface Post {
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

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "confirmed":
      return <Badge variant="secondary">確定済み</Badge>;
    case "posted":
      return <Badge variant="success">投稿済み</Badge>;
    case "scheduled":
      return <Badge variant="warning">予約済み</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  const percentage = Math.round(score * 100);
  const color =
    percentage >= 70
      ? "bg-green-500"
      : percentage >= 40
        ? "bg-yellow-500"
        : "bg-red-500";

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span>{label}</span>
        <span className="font-mono">{percentage}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-neutral-200 dark:bg-neutral-700">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch("/api/history");
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();
      setPosts(data.posts);
    } catch {
      toast.error("履歴の取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
      return;
    }
    if (status === "authenticated") {
      fetchPosts();
    }
  }, [status, router, fetchPosts]);

  const handleCopy = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    toast.success("クリップボードにコピーしました");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/history?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete post");
      toast.success("投稿を削除しました");
      fetchPosts();
    } catch {
      toast.error("投稿の削除に失敗しました");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-neutral-500">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold">投稿履歴</h1>
        <p className="text-neutral-500">
          確定した投稿の履歴を管理できます。
        </p>
      </div>

      {posts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-neutral-500">
            まだ確定した投稿がありません。AI生成ページで投稿を作成しましょう。
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={post.status} />
                      <Badge variant="outline">{post.llmProvider}</Badge>
                      <span className="text-xs text-neutral-500">
                        {new Date(post.createdAt).toLocaleString("ja-JP")}
                      </span>
                    </div>
                    <CardDescription>{post.llmModel}</CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleCopy(post.content, post.id)}
                    >
                      {copiedId === post.id ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(post.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Post content */}
                <div className="rounded-lg border bg-neutral-50 p-4 dark:bg-neutral-900">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {post.content}
                  </p>
                </div>

                {/* Quality scores */}
                <div className="grid gap-2 sm:grid-cols-2">
                  <ScoreBar
                    label="品質スコア"
                    score={post.qualityScore}
                  />
                  <ScoreBar
                    label="エンゲージメント"
                    score={post.engagementScore}
                  />
                </div>

                {/* Posted metrics */}
                {post.status === "posted" && (
                  <div className="flex flex-wrap gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                    <span>いいね: {post.likes}</span>
                    <span>RT: {post.retweets}</span>
                    <span>リプライ: {post.replies}</span>
                    <span>インプレッション: {post.impressions}</span>
                    <span>ブックマーク: {post.bookmarks}</span>
                  </div>
                )}

                {/* Coaching accordion */}
                {post.coachingAdvice && (
                  <Accordion type="single" collapsible>
                    <AccordionItem value="coaching">
                      <AccordionTrigger>
                        <span className="flex items-center gap-1.5">
                          <BarChart3 className="h-4 w-4" />
                          コーチングアドバイス
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="rounded-lg bg-blue-50 p-3 text-sm dark:bg-blue-950">
                          <p className="whitespace-pre-wrap">
                            {post.coachingAdvice}
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
