"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/lib/guest";
import * as store from "@/lib/local-store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Sparkles,
  Loader2,
  Copy,
  Check,
  BookmarkPlus,
  BarChart3,
  Flame,
  Send,
} from "lucide-react";
import toast from "react-hot-toast";

interface DraftResult {
  id?: string;
  content: string;
  provider: string;
  model: string;
  qualityScore: number;
  engagementScore: number;
  clarityScore: number;
  hookScore: number;
  replyPotential: number;
  controversyRisk: number;
  coachingAdvice: string;
  hashtags: string;
  charCount: number;
}

const TONES = [
  { value: "casual", label: "カジュアル" },
  { value: "professional", label: "プロフェッショナル" },
  { value: "humorous", label: "ユーモア" },
  { value: "provocative", label: "挑発的" },
  { value: "informative", label: "情報提供" },
  { value: "inspirational", label: "インスピレーション" },
  { value: "analytical", label: "分析的" },
];

const TARGETS = [
  { value: "general", label: "一般" },
  { value: "tech", label: "エンジニア" },
  { value: "business", label: "ビジネスパーソン" },
  { value: "creator", label: "クリエイター" },
  { value: "student", label: "学生" },
  { value: "marketer", label: "マーケター" },
];

const PROVIDERS = [
  { id: "claude", name: "Claude", description: "論理的・分析的" },
  { id: "chatgpt", name: "ChatGPT", description: "クリエイティブ" },
  { id: "gemini", name: "Gemini", description: "データドリブン" },
  { id: "grok", name: "Grok", description: "ウィット・X文化" },
];

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

function AISheetTabs({
  drafts,
  onConfirm,
  confirming,
  isGuest,
}: {
  drafts: DraftResult[];
  onConfirm: (draft: DraftResult) => void;
  confirming: boolean;
  isGuest: boolean;
}) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [postingId, setPostingId] = useState<string | null>(null);

  const handleCopy = async (content: string, provider: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(provider);
    toast.success("クリップボードにコピーしました");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePostToX = async (draft: DraftResult) => {
    setPostingId(draft.provider);
    try {
      const res = await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: draft.content }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "投稿に失敗しました");
      }
      toast.success("Xに投稿しました！");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "投稿に失敗しました"
      );
    } finally {
      setPostingId(null);
    }
  };

  if (drafts.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-neutral-500">
          左のパネルでトピックを入力し、AIプロバイダーを選択して生成してください。
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs defaultValue={drafts[0]?.provider ?? "claude"}>
      <TabsList className="w-full">
        {drafts.map((draft) => (
          <TabsTrigger key={draft.provider} value={draft.provider}>
            {draft.provider}
            <Badge variant="secondary" className="ml-1.5 text-[10px]">
              {Math.round(draft.qualityScore * 100)}
            </Badge>
          </TabsTrigger>
        ))}
      </TabsList>
      {drafts.map((draft) => (
        <TabsContent key={draft.provider} value={draft.provider}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">
                    {draft.provider} - {draft.model}
                  </CardTitle>
                  <CardDescription>
                    {draft.charCount}文字 / 280文字
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(draft.content, draft.provider)}
                  >
                    {copiedId === draft.provider ? (
                      <Check className="mr-1 h-3.5 w-3.5" />
                    ) : (
                      <Copy className="mr-1 h-3.5 w-3.5" />
                    )}
                    コピー
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onConfirm(draft)}
                    disabled={confirming}
                  >
                    <BookmarkPlus className="mr-1 h-3.5 w-3.5" />
                    確定
                  </Button>
                  {!isGuest && (
                    <Button
                      size="sm"
                      variant="default"
                      className="bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                      onClick={() => handlePostToX(draft)}
                      disabled={postingId === draft.provider}
                    >
                      {postingId === draft.provider ? (
                        <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Send className="mr-1 h-3.5 w-3.5" />
                      )}
                      Xに投稿
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Generated content */}
              <div className="rounded-lg border bg-neutral-50 p-4 dark:bg-neutral-900">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {draft.content}
                </p>
              </div>

              {/* Quality scores */}
              <div>
                <h4 className="mb-3 flex items-center gap-1.5 text-sm font-medium">
                  <BarChart3 className="h-4 w-4" />
                  品質スコア
                </h4>
                <div className="grid gap-2">
                  <ScoreBar
                    label="総合スコア"
                    score={draft.qualityScore}
                  />
                  <ScoreBar
                    label="エンゲージメント"
                    score={draft.engagementScore}
                  />
                  <ScoreBar label="明瞭性" score={draft.clarityScore} />
                  <ScoreBar label="フック力" score={draft.hookScore} />
                  <ScoreBar
                    label="リプライ誘発"
                    score={draft.replyPotential}
                  />
                  <ScoreBar
                    label="炎上リスク"
                    score={draft.controversyRisk}
                  />
                </div>
              </div>

              {/* Coaching advice */}
              {draft.coachingAdvice && (
                <div>
                  <h4 className="mb-2 text-sm font-medium">
                    コーチングアドバイス
                  </h4>
                  <div className="rounded-lg border bg-blue-50 p-3 text-sm dark:bg-blue-950">
                    <p className="whitespace-pre-wrap">
                      {draft.coachingAdvice}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
}

function GeneratePage() {
  const { isAuthenticated, isGuest, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [topic, setTopic] = useState(
    searchParams.get("content") ?? ""
  );
  const ideaId = searchParams.get("ideaId") ?? undefined;
  const [tone, setTone] = useState("casual");
  const [target, setTarget] = useState("general");
  const [additionalContext, setAdditionalContext] = useState("");
  const [selectedProviders, setSelectedProviders] = useState<
    Record<string, boolean>
  >({
    claude: true,
    chatgpt: false,
    gemini: false,
    grok: false,
  });
  const [useReference, setUseReference] = useState(false);
  const [refPostCount, setRefPostCount] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [drafts, setDrafts] = useState<DraftResult[]>([]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/");
      return;
    }
    const refs = store.getReferencePosts();
    setRefPostCount(refs.length);
    if (refs.length > 0) setUseReference(true);
  }, [isAuthenticated, isLoading, router]);

  const toggleProvider = (id: string) => {
    setSelectedProviders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("トピックを入力してください");
      return;
    }

    const providers = Object.entries(selectedProviders)
      .filter(([, enabled]) => enabled)
      .map(([id]) => id);

    if (providers.length === 0) {
      toast.error("AIプロバイダーを1つ以上選択してください");
      return;
    }

    setGenerating(true);
    setDrafts([]);

    try {
      // Build reference context from buzz posts
      let refContext = additionalContext.trim() || "";
      if (useReference) {
        const refPosts = store.getReferencePosts();
        if (refPosts.length > 0) {
          const refText = refPosts
            .slice(0, 5)
            .map(
              (p, i) =>
                `[参考バズポスト${i + 1}] (いいね:${p.likes} RT:${p.retweets} リプ:${p.replies})\n${p.content}${p.memo ? `\n→成功要因: ${p.memo}` : ""}`
            )
            .join("\n\n");
          const prefix =
            "以下は投稿者の過去のバズポストです。文体・構造・トーンを参考にして、同じ人が書いたような投稿を生成してください:\n\n";
          refContext = refContext
            ? `${prefix}${refText}\n\n---\n追加指示: ${refContext}`
            : `${prefix}${refText}`;
        }
      }

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ideaContent: topic.trim(),
          ideaId,
          providers,
          tone,
          targetAudience: target,
          additionalContext: refContext || undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "生成に失敗しました");
      }

      const data = await res.json();
      setDrafts(data.drafts);
      toast.success(`${data.drafts.length}件の投稿案を生成しました`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "生成に失敗しました"
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleConfirm = async (draft: DraftResult) => {
    setConfirming(true);
    if (isGuest) {
      store.addPost({
        content: draft.content,
        llmProvider: draft.provider,
        llmModel: draft.model,
        qualityScore: draft.qualityScore,
        engagementScore: draft.engagementScore,
        status: "confirmed",
        coachingAdvice: draft.coachingAdvice,
        xPostId: null,
        postedAt: null,
        scheduledAt: null,
      });
      toast.success("投稿を確定しました");
      router.push("/history");
      setConfirming(false);
      return;
    }
    try {
      const res = await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draftId: draft.id,
          content: draft.content,
          llmProvider: draft.provider,
          llmModel: draft.model,
          qualityScore: draft.qualityScore,
          engagementScore: draft.engagementScore,
          coachingAdvice: draft.coachingAdvice,
          ideaId,
        }),
      });
      if (!res.ok) throw new Error("Failed to confirm");
      toast.success("投稿を確定しました");
      router.push("/history");
    } catch {
      toast.error("投稿の確定に失敗しました");
    } finally {
      setConfirming(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-neutral-500">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold">AI生成</h1>
        <p className="text-neutral-500">
          複数のAIプロバイダーで投稿を同時生成し、最適なものを選びましょう。
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
        {/* Left panel - Settings */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">生成設定</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Topic */}
              <div>
                <Label htmlFor="topic">トピック・テーマ</Label>
                <Textarea
                  id="topic"
                  placeholder="投稿のテーマやアイデアを入力..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="mt-1.5 min-h-[100px]"
                />
              </div>

              {/* Tone */}
              <div>
                <Label htmlFor="tone">トーン</Label>
                <select
                  id="tone"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="mt-1.5 flex h-9 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 dark:border-neutral-800 dark:focus-visible:ring-neutral-300"
                >
                  {TONES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Target audience */}
              <div>
                <Label htmlFor="target">ターゲット</Label>
                <select
                  id="target"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="mt-1.5 flex h-9 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 dark:border-neutral-800 dark:focus-visible:ring-neutral-300"
                >
                  {TARGETS.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Additional context */}
              <div>
                <Label htmlFor="context">追加コンテキスト（任意）</Label>
                <Textarea
                  id="context"
                  placeholder="補足情報やスタイルの指示..."
                  value={additionalContext}
                  onChange={(e) => setAdditionalContext(e.target.value)}
                  className="mt-1.5 min-h-[60px]"
                />
              </div>

              {/* Reference posts toggle */}
              {refPostCount > 0 && (
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <div>
                      <p className="text-sm font-medium">バズポスト参照</p>
                      <p className="text-[10px] text-neutral-500">
                        {refPostCount}件の登録ポストを参考に生成
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={useReference}
                    onChange={(e) => setUseReference(e.target.checked)}
                    className="h-4 w-4 rounded border-neutral-300"
                  />
                </div>
              )}

              {/* Provider switches */}
              <div>
                <Label className="mb-2 block">AIプロバイダー</Label>
                <div className="space-y-2">
                  {PROVIDERS.map((provider) => (
                    <label
                      key={provider.id}
                      className="flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900"
                    >
                      <div>
                        <span className="text-sm font-medium">
                          {provider.name}
                        </span>
                        <span className="ml-2 text-xs text-neutral-500">
                          {provider.description}
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedProviders[provider.id] ?? false}
                        onChange={() => toggleProvider(provider.id)}
                        className="h-4 w-4 rounded border-neutral-300"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <Button
                className="w-full"
                onClick={handleGenerate}
                disabled={generating}
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-1.5 h-4 w-4" />
                    投稿を生成
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right panel - Results */}
        <div>
          <AISheetTabs
            drafts={drafts}
            onConfirm={handleConfirm}
            confirming={confirming}
            isGuest={isGuest}
          />
        </div>
      </div>
    </div>
  );
}

export default function GeneratePageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="animate-pulse text-neutral-500">読み込み中...</div>
        </div>
      }
    >
      <GeneratePage />
    </Suspense>
  );
}
