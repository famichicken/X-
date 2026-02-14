"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Sparkles, Trash2, Edit2, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/guest";
import * as store from "@/lib/local-store";

interface Idea {
  id: string;
  content: string;
  category: string;
  tags: string;
  tone: string;
  hashtags: string;
  priority: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const CATEGORIES = [
  { value: "general", label: "一般" },
  { value: "tech", label: "テック" },
  { value: "business", label: "ビジネス" },
  { value: "lifestyle", label: "ライフスタイル" },
  { value: "opinion", label: "意見・考察" },
  { value: "tips", label: "Tips・ノウハウ" },
  { value: "news", label: "ニュース" },
  { value: "humor", label: "ユーモア" },
];

const TONES = [
  { value: "casual", label: "カジュアル" },
  { value: "professional", label: "プロフェッショナル" },
  { value: "humorous", label: "ユーモア" },
  { value: "provocative", label: "挑発的" },
  { value: "informative", label: "情報提供" },
  { value: "inspirational", label: "インスピレーション" },
  { value: "analytical", label: "分析的" },
];

function IdeaCard({
  idea,
  onDelete,
  onUpdate,
  onGenerate,
}: {
  idea: Idea;
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: Partial<Idea>) => void;
  onGenerate: (idea: Idea) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(idea.content);

  const handleSave = () => {
    onUpdate(idea.id, { content: editContent });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditContent(idea.content);
    setIsEditing(false);
  };

  const tags = idea.tags
    ? idea.tags.split(",").filter((t) => t.trim())
    : [];
  const categoryLabel =
    CATEGORIES.find((c) => c.value === idea.category)?.label ?? idea.category;
  const toneLabel =
    TONES.find((t) => t.value === idea.tone)?.label ?? idea.tone;

  return (
    <Card className="group relative">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="secondary">{categoryLabel}</Badge>
            {idea.tone && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {toneLabel}
              </Badge>
            )}
            {tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag.trim()}
              </Badge>
            ))}
          </div>
          <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            {isEditing ? (
              <>
                <Button size="icon" variant="ghost" onClick={handleSave}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={handleCancel}>
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onDelete(idea.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="min-h-[80px]"
          />
        ) : (
          <>
            <p className="whitespace-pre-wrap text-sm">{idea.content}</p>
            {idea.hashtags && (
              <p className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                {idea.hashtags}
              </p>
            )}
          </>
        )}
      </CardContent>
      <CardFooter className="justify-between pt-0">
        <span className="text-xs text-neutral-500">
          {new Date(idea.createdAt).toLocaleDateString("ja-JP")}
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onGenerate(idea)}
        >
          <Sparkles className="mr-1.5 h-3.5 w-3.5" />
          生成
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function IdeasPage() {
  const { isAuthenticated, isGuest, isLoading } = useAuth();
  const router = useRouter();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("general");
  const [newTags, setNewTags] = useState("");
  const [newTone, setNewTone] = useState("casual");
  const [newHashtags, setNewHashtags] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchIdeas = useCallback(async () => {
    if (isGuest) {
      setIdeas(store.getIdeas());
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/ideas");
      if (!res.ok) throw new Error("Failed to fetch ideas");
      const data = await res.json();
      setIdeas(data.ideas);
    } catch {
      toast.error("アイデアの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }, [isGuest]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/");
      return;
    }
    if (isAuthenticated) {
      fetchIdeas();
    }
  }, [isAuthenticated, isLoading, router, fetchIdeas]);

  const handleAdd = async () => {
    if (!newContent.trim()) {
      toast.error("内容を入力してください");
      return;
    }
    setSubmitting(true);
    if (isGuest) {
      store.addIdea({
        content: newContent.trim(),
        category: newCategory,
        tags: newTags.trim(),
        tone: newTone,
        hashtags: newHashtags.trim(),
        priority: 0,
        status: "active",
      });
      setNewContent("");
      setNewTags("");
      setNewCategory("general");
      setNewTone("casual");
      setNewHashtags("");
      toast.success("アイデアを追加しました");
      fetchIdeas();
      setSubmitting(false);
      return;
    }
    try {
      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newContent.trim(),
          category: newCategory,
          tags: newTags.trim(),
          tone: newTone,
          hashtags: newHashtags.trim(),
        }),
      });
      if (!res.ok) throw new Error("Failed to create idea");
      setNewContent("");
      setNewTags("");
      setNewCategory("general");
      setNewTone("casual");
      setNewHashtags("");
      toast.success("アイデアを追加しました");
      fetchIdeas();
    } catch {
      toast.error("アイデアの追加に失敗しました");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (isGuest) {
      store.deleteIdea(id);
      toast.success("アイデアを削除しました");
      fetchIdeas();
      return;
    }
    try {
      const res = await fetch(`/api/ideas?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete idea");
      toast.success("アイデアを削除しました");
      fetchIdeas();
    } catch {
      toast.error("アイデアの削除に失敗しました");
    }
  };

  const handleUpdate = async (id: string, data: Partial<Idea>) => {
    if (isGuest) {
      store.updateIdea(id, data);
      toast.success("アイデアを更新しました");
      fetchIdeas();
      return;
    }
    try {
      const res = await fetch("/api/ideas", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...data }),
      });
      if (!res.ok) throw new Error("Failed to update idea");
      toast.success("アイデアを更新しました");
      fetchIdeas();
    } catch {
      toast.error("アイデアの更新に失敗しました");
    }
  };

  const handleGenerate = (idea: Idea) => {
    const params = new URLSearchParams({
      content: idea.content,
    });
    if (idea.id) params.set("ideaId", idea.id);
    if (idea.tone) params.set("tone", idea.tone);
    if (idea.hashtags) params.set("hashtags", idea.hashtags);
    router.push(`/generate?${params.toString()}`);
  };

  if (isLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-neutral-500">読み込み中...</div>
      </div>
    );
  }

  const activeIdeas = ideas.filter((idea) => idea.status === "active");
  const usedIdeas = ideas.filter((idea) => idea.status === "used");

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold">ネタ帳</h1>
        <p className="text-neutral-500">
          投稿アイデアを管理して、AI生成に活用しましょう。
        </p>
      </div>

      {/* Add new idea form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">新しいアイデアを追加</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="idea-content">内容</Label>
            <Textarea
              id="idea-content"
              placeholder="投稿のアイデアを入力..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="mt-1.5 min-h-[100px]"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="idea-category">カテゴリ</Label>
              <select
                id="idea-category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="mt-1.5 flex h-9 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 dark:border-neutral-800 dark:focus-visible:ring-neutral-300"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="idea-tone">トーン</Label>
              <select
                id="idea-tone"
                value={newTone}
                onChange={(e) => setNewTone(e.target.value)}
                className="mt-1.5 flex h-9 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 dark:border-neutral-800 dark:focus-visible:ring-neutral-300"
              >
                {TONES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="idea-tags">タグ（カンマ区切り）</Label>
              <Input
                id="idea-tags"
                placeholder="AI, プログラミング, 生産性"
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="idea-hashtags">ハッシュタグ</Label>
              <Input
                id="idea-hashtags"
                placeholder="#AI #プログラミング #生産性向上"
                value={newHashtags}
                onChange={(e) => setNewHashtags(e.target.value)}
                className="mt-1.5"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAdd} disabled={submitting}>
            <Plus className="mr-1.5 h-4 w-4" />
            {submitting ? "追加中..." : "アイデアを追加"}
          </Button>
        </CardFooter>
      </Card>

      {/* Active ideas */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold">
          アクティブなアイデア ({activeIdeas.length})
        </h2>
        {activeIdeas.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-neutral-500">
              まだアイデアがありません。上のフォームから追加しましょう。
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {activeIdeas.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
                onGenerate={handleGenerate}
              />
            ))}
          </div>
        )}
      </div>

      {/* Used ideas */}
      {usedIdeas.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-neutral-500">
            使用済みアイデア ({usedIdeas.length})
          </h2>
          <div className="grid gap-4 opacity-60 sm:grid-cols-2">
            {usedIdeas.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
                onGenerate={handleGenerate}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
