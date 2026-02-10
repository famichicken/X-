"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QualityScoreCard } from "@/components/quality-score";
import { CoachingAccordion } from "@/components/coaching-accordion";
import { Check, Copy, RefreshCw } from "lucide-react";
import type { Draft } from "@/store/app-store";

const providerLabels: Record<string, string> = {
  chatgpt: "ChatGPT",
  claude: "Claude",
  gemini: "Gemini",
  grok: "Grok",
};

interface AISheetTabsProps {
  drafts: Draft[];
  onConfirm?: (draft: Draft) => void;
  onCopy?: (content: string) => void;
  onRegenerate?: (draft: Draft) => void;
}

export function AISheetTabs({
  drafts,
  onConfirm,
  onCopy,
  onRegenerate,
}: AISheetTabsProps) {
  if (drafts.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-neutral-500 dark:text-neutral-400">
        生成結果がありません
      </div>
    );
  }

  const defaultTab = drafts[0]?.provider ?? "";

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="w-full">
        {drafts.map((draft) => (
          <TabsTrigger
            key={draft.provider}
            value={draft.provider}
            className="flex-1 gap-1.5"
          >
            <span className="text-xs font-medium">
              {providerLabels[draft.provider] ?? draft.provider}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>

      {drafts.map((draft) => (
        <TabsContent key={draft.provider} value={draft.provider}>
          <div className="space-y-4 pt-2">
            {/* Provider info */}
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {providerLabels[draft.provider] ?? draft.provider}
              </Badge>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                {draft.model}
              </span>
              <span className="ml-auto text-xs text-neutral-400 dark:text-neutral-500">
                {draft.content.length}文字
              </span>
            </div>

            {/* Content box */}
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-900">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
                {draft.content}
              </p>
            </div>

            {/* Hashtags */}
            {draft.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {draft.hashtags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Quality Score Card */}
            <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-700">
              <h3 className="mb-3 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                品質スコア
              </h3>
              <QualityScoreCard scores={draft.scores} />
            </div>

            {/* Coaching Accordion */}
            <CoachingAccordion coaching={draft.coaching} />

            {/* Footer actions */}
            <div className="flex items-center gap-2 border-t border-neutral-200 pt-4 dark:border-neutral-700">
              {onConfirm && (
                <Button
                  onClick={() => onConfirm(draft)}
                  className="flex-1"
                >
                  <Check className="mr-2 h-4 w-4" />
                  確定
                </Button>
              )}
              {onCopy && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onCopy(draft.content)}
                  title="コピー"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
              {onRegenerate && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onRegenerate(draft)}
                  title="再生成"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
