"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Lightbulb, Sparkles, BarChart3, GraduationCap } from "lucide-react";

const features = [
  {
    icon: Lightbulb,
    title: "ネタ帳",
    description:
      "投稿アイデアをカテゴリ・タグで整理。思いついたときにすぐメモして、いつでも投稿に活用できます。",
  },
  {
    icon: Sparkles,
    title: "AI生成",
    description:
      "Claude・ChatGPT・Gemini・Grokの4つのAIを同時に活用。複数の候補から最適な投稿を選べます。",
  },
  {
    icon: BarChart3,
    title: "品質スコアリング",
    description:
      "Xアルゴリズムの重み付けに基づいた品質チェック。エンゲージメント・フック力・リプライ誘発度を数値化します。",
  },
  {
    icon: GraduationCap,
    title: "コーチング",
    description:
      "AIが投稿の強みと改善点を分析。アルゴリズム最適化のヒントで、投稿スキルを継続的に向上できます。",
  },
];

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session) {
      router.replace("/ideas");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-neutral-500">読み込み中...</div>
      </div>
    );
  }

  if (status === "authenticated") {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          X Post Generator
        </h1>
        <p className="mb-2 text-xl text-neutral-600 dark:text-neutral-400">
          AI投稿生成ツール
        </p>
        <p className="mb-12 text-neutral-500 dark:text-neutral-500">
          Xアルゴリズムを理解したAIが、エンゲージメントを最大化する投稿を生成します。
        </p>

        <div className="mb-12 grid gap-6 sm:grid-cols-2">
          {features.map((feature) => (
            <Card key={feature.title} className="text-left">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
                  <feature.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button
          size="lg"
          className="h-12 px-8 text-base"
          onClick={() => signIn("twitter")}
        >
          Xでログインして始める
        </Button>
      </div>
    </div>
  );
}
