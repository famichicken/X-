"use client";

import { cn } from "@/lib/utils";

function getScoreColor(score: number): string {
  if (score >= 0.8) return "text-green-600 dark:text-green-400";
  if (score >= 0.6) return "text-yellow-600 dark:text-yellow-400";
  if (score >= 0.4) return "text-orange-600 dark:text-orange-400";
  return "text-red-600 dark:text-red-400";
}

function getBarColor(score: number): string {
  if (score >= 0.8) return "bg-green-500";
  if (score >= 0.6) return "bg-yellow-500";
  if (score >= 0.4) return "bg-orange-500";
  return "bg-red-500";
}

interface QualityScoreProps {
  label: string;
  score: number;
  showBar?: boolean;
  size?: "sm" | "md";
}

export function QualityScore({
  label,
  score,
  showBar = false,
  size = "md",
}: QualityScoreProps) {
  const displayScore = Math.round(score * 100);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "text-neutral-600 dark:text-neutral-400",
            size === "sm" ? "text-xs" : "text-sm"
          )}
        >
          {label}
        </span>
        <span
          className={cn(
            "font-semibold",
            getScoreColor(score),
            size === "sm" ? "text-xs" : "text-sm"
          )}
        >
          {displayScore}%
        </span>
      </div>
      {showBar && (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
          <div
            className={cn("h-full rounded-full transition-all", getBarColor(score))}
            style={{ width: `${displayScore}%` }}
          />
        </div>
      )}
    </div>
  );
}

interface QualityScoreCardProps {
  scores: {
    overall: number;
    engagement: number;
    clarity: number;
    hook: number;
    replyPotential: number;
    controversyRisk: number;
  };
}

const scoreLabels: Record<string, string> = {
  engagement: "エンゲージメント",
  clarity: "明瞭さ",
  hook: "フック力",
  replyPotential: "リプライ誘発力",
  controversyRisk: "炎上リスク",
};

export function QualityScoreCard({ scores }: QualityScoreCardProps) {
  const overallDisplay = Math.round(scores.overall * 100);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "text-3xl font-bold",
            getScoreColor(scores.overall)
          )}
        >
          {overallDisplay}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
            総合スコア
          </span>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            / 100
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {(
          Object.entries(scoreLabels) as [string, string][]
        ).map(([key, label]) => (
          <QualityScore
            key={key}
            label={label}
            score={scores[key as keyof typeof scores] ?? 0}
            showBar
            size="sm"
          />
        ))}
      </div>
    </div>
  );
}
