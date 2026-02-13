"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/guest";
import * as store from "@/lib/local-store";

interface Settings {
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

const LLM_OPTIONS = [
  { value: "claude", label: "Claude" },
  { value: "chatgpt", label: "ChatGPT" },
  { value: "gemini", label: "Gemini" },
  { value: "grok", label: "Grok" },
];

const TONE_OPTIONS = [
  { value: "casual", label: "カジュアル" },
  { value: "professional", label: "プロフェッショナル" },
  { value: "humorous", label: "ユーモア" },
  { value: "provocative", label: "挑発的" },
  { value: "informative", label: "情報提供" },
  { value: "inspirational", label: "インスピレーション" },
  { value: "analytical", label: "分析的" },
];

export default function SettingsPage() {
  const { isAuthenticated, isGuest, isLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    claudeApiKey: "",
    chatgptApiKey: "",
    geminiApiKey: "",
    grokApiKey: "",
    defaultLlm: "claude",
    defaultTone: "casual",
    hashtagCount: 2,
    emojiLimit: 2,
    brandVoice: "",
    ngWords: "",
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/");
      return;
    }
    if (isAuthenticated) {
      fetchSettings();
    }
  }, [isAuthenticated, isLoading, router]);

  const fetchSettings = async () => {
    if (isGuest) {
      setSettings(store.getSettings());
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error("Failed to fetch settings");
      const data = await res.json();
      if (data.settings) {
        setSettings(data.settings);
      }
    } catch {
      toast.error("設定の取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    if (isGuest) {
      store.saveSettings(settings);
      toast.success("設定を保存しました");
      setSaving(false);
      return;
    }
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Failed to save settings");
      toast.success("設定を保存しました");
    } catch {
      toast.error("設定の保存に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = <K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (isLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-neutral-500">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold">設定</h1>
        <p className="text-neutral-500">
          APIキーとデフォルト設定を管理します。
          {isGuest && " (ゲストモード: データはブラウザに保存されます)"}
        </p>
      </div>

      <div className="space-y-6">
        {/* API Keys */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">APIキー</CardTitle>
            <CardDescription>
              各AIプロバイダーのAPIキーを設定します。
              {isGuest
                ? "キーはブラウザのローカルストレージに保存されます。"
                : "キーは暗号化して保存されます。"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="claude-key">Claude API Key</Label>
              <Input
                id="claude-key"
                type="password"
                placeholder="sk-ant-..."
                value={settings.claudeApiKey}
                onChange={(e) =>
                  updateSetting("claudeApiKey", e.target.value)
                }
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="chatgpt-key">ChatGPT API Key</Label>
              <Input
                id="chatgpt-key"
                type="password"
                placeholder="sk-..."
                value={settings.chatgptApiKey}
                onChange={(e) =>
                  updateSetting("chatgptApiKey", e.target.value)
                }
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="gemini-key">Gemini API Key</Label>
              <Input
                id="gemini-key"
                type="password"
                placeholder="AIza..."
                value={settings.geminiApiKey}
                onChange={(e) =>
                  updateSetting("geminiApiKey", e.target.value)
                }
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="grok-key">Grok API Key</Label>
              <Input
                id="grok-key"
                type="password"
                placeholder="xai-..."
                value={settings.grokApiKey}
                onChange={(e) =>
                  updateSetting("grokApiKey", e.target.value)
                }
                className="mt-1.5"
              />
            </div>
          </CardContent>
        </Card>

        {/* Default Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">デフォルト設定</CardTitle>
            <CardDescription>
              生成時のデフォルト値を設定します。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="default-llm">デフォルトLLM</Label>
              <select
                id="default-llm"
                value={settings.defaultLlm}
                onChange={(e) =>
                  updateSetting("defaultLlm", e.target.value)
                }
                className="mt-1.5 flex h-9 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 dark:border-neutral-800 dark:focus-visible:ring-neutral-300"
              >
                {LLM_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="default-tone">デフォルトトーン</Label>
              <select
                id="default-tone"
                value={settings.defaultTone}
                onChange={(e) =>
                  updateSetting("defaultTone", e.target.value)
                }
                className="mt-1.5 flex h-9 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 dark:border-neutral-800 dark:focus-visible:ring-neutral-300"
              >
                {TONE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="hashtag-count">ハッシュタグ数</Label>
                <Input
                  id="hashtag-count"
                  type="number"
                  min={0}
                  max={10}
                  value={settings.hashtagCount}
                  onChange={(e) =>
                    updateSetting(
                      "hashtagCount",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="emoji-limit">絵文字上限</Label>
                <Input
                  id="emoji-limit"
                  type="number"
                  min={0}
                  max={20}
                  value={settings.emojiLimit}
                  onChange={(e) =>
                    updateSetting(
                      "emojiLimit",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="mt-1.5"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Brand Voice & NG Words */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">ブランドボイス</CardTitle>
            <CardDescription>
              投稿のトーンや禁止ワードをカスタマイズします。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="brand-voice">ブランドボイス</Label>
              <Textarea
                id="brand-voice"
                placeholder="例: テック業界に精通したプロフェッショナル。データに基づく主張を好み、フレンドリーだが権威性のある口調。"
                value={settings.brandVoice}
                onChange={(e) =>
                  updateSetting("brandVoice", e.target.value)
                }
                className="mt-1.5 min-h-[100px]"
              />
            </div>
            <div>
              <Label htmlFor="ng-words">NGワード（カンマ区切り）</Label>
              <Input
                id="ng-words"
                placeholder="フォロバ, 相互フォロー, 拡散希望"
                value={settings.ngWords}
                onChange={(e) =>
                  updateSetting("ngWords", e.target.value)
                }
                className="mt-1.5"
              />
              <p className="mt-1 text-xs text-neutral-500">
                デフォルトのNGワードリストに追加されます。
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Save */}
        <Button
          className="w-full"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              保存中...
            </>
          ) : (
            <>
              <Save className="mr-1.5 h-4 w-4" />
              設定を保存
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
