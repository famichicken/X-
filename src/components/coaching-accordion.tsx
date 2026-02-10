"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface CoachingData {
  strengths: string[];
  improvements: string[];
  algorithmTips: string[];
  engagementPrediction: string;
}

interface CoachingAccordionProps {
  coaching: CoachingData;
  additionalInfo?: string;
}

export function CoachingAccordion({
  coaching,
  additionalInfo,
}: CoachingAccordionProps) {
  return (
    <Accordion type="multiple" className="w-full">
      <AccordionItem value="coaching">
        <AccordionTrigger className="text-sm font-medium">
          AIコーチング
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            {/* Strengths */}
            {coaching.strengths.length > 0 && (
              <div className="space-y-2">
                <h4 className="flex items-center gap-2 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    +
                  </Badge>
                  強み
                </h4>
                <ul className="space-y-1 pl-4">
                  {coaching.strengths.map((strength, index) => (
                    <li
                      key={index}
                      className="text-sm text-neutral-600 dark:text-neutral-400"
                    >
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Improvements */}
            {coaching.improvements.length > 0 && (
              <div className="space-y-2">
                <h4 className="flex items-center gap-2 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                    !
                  </Badge>
                  改善ポイント
                </h4>
                <ul className="space-y-1 pl-4">
                  {coaching.improvements.map((improvement, index) => (
                    <li
                      key={index}
                      className="text-sm text-neutral-600 dark:text-neutral-400"
                    >
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Algorithm Tips */}
            {coaching.algorithmTips.length > 0 && (
              <div className="space-y-2">
                <h4 className="flex items-center gap-2 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    i
                  </Badge>
                  アルゴリズムTips
                </h4>
                <ul className="space-y-1 pl-4">
                  {coaching.algorithmTips.map((tip, index) => (
                    <li
                      key={index}
                      className="text-sm text-neutral-600 dark:text-neutral-400"
                    >
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Engagement Prediction */}
            {coaching.engagementPrediction && (
              <div className="rounded-md bg-neutral-50 p-3 dark:bg-neutral-900">
                <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                  エンゲージメント予測
                </p>
                <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
                  {coaching.engagementPrediction}
                </p>
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>

      {additionalInfo && (
        <AccordionItem value="additional">
          <AccordionTrigger className="text-sm font-medium">
            追加情報
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {additionalInfo}
            </p>
          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  );
}
