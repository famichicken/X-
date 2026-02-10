import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getProvider } from "@/lib/llm";
import { runQualityChecks, calculateCompositeScore } from "@/lib/scoring";
import { z } from "zod";

const generateSchema = z.object({
  ideaContent: z.string().min(1, "トピックを入力してください").max(2000),
  ideaId: z.string().optional(),
  providers: z
    .array(z.enum(["claude", "chatgpt", "gemini", "grok"]))
    .min(1, "プロバイダーを1つ以上選択してください"),
  tone: z.string().default("casual"),
  targetAudience: z.string().default("general"),
  additionalContext: z.string().max(1000).optional(),
});

async function getSessionUser() {
  const session = await auth();
  if (!session?.user) return null;
  return (session.user as { id: string }).id;
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getSessionUser();
    if (!userId) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = generateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "入力データが不正です", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { ideaContent, ideaId, providers, tone, targetAudience, additionalContext } =
      parsed.data;

    // Load user settings for API keys and preferences
    const userSettings = await prisma.userSettings.findUnique({
      where: { userId },
    });

    if (!userSettings) {
      return NextResponse.json(
        { error: "設定が見つかりません。先にAPIキーを設定してください。" },
        { status: 400 }
      );
    }

    const apiKeyMap: Record<string, string | null> = {
      claude: userSettings.claudeApiKey,
      chatgpt: userSettings.chatgptApiKey,
      gemini: userSettings.geminiApiKey,
      grok: userSettings.grokApiKey,
    };

    // Validate that requested providers have API keys
    const missingKeys = providers.filter((p) => !apiKeyMap[p]);
    if (missingKeys.length > 0) {
      return NextResponse.json(
        {
          error: `以下のプロバイダーのAPIキーが設定されていません: ${missingKeys.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const generationParams = {
      idea: ideaContent,
      tone,
      targetAudience,
      brandVoice: userSettings.brandVoice || "",
      maxLength: 280,
      hashtagCount: userSettings.hashtagCount,
      emojiLimit: userSettings.emojiLimit,
      additionalContext,
    };

    // Call all providers in parallel
    const results = await Promise.allSettled(
      providers.map(async (providerName) => {
        const provider = getProvider(providerName);
        const apiKey = apiKeyMap[providerName]!;
        const result = await provider.generate(generationParams, apiKey);
        return { providerName, result };
      })
    );

    const customNgWords = userSettings.ngWords
      ? userSettings.ngWords.split(",").map((w) => w.trim()).filter(Boolean)
      : [];

    const drafts = [];

    for (const result of results) {
      if (result.status === "fulfilled") {
        const { providerName, result: genResult } = result.value;

        // Run quality checks on the generated content
        const qualityCheckResult = runQualityChecks(genResult.content, {
          maxHashtags: userSettings.hashtagCount + 1,
          maxEmojis: userSettings.emojiLimit + 2,
          customNgWords,
        });

        // Calculate composite score
        const compositeScore = calculateCompositeScore({
          engagement: genResult.scores.engagement,
          clarity: genResult.scores.clarity,
          hook: genResult.scores.hook,
          replyPotential: genResult.scores.replyPotential,
          controversyRisk: genResult.scores.controversyRisk,
        });

        // Format coaching advice
        const coaching = genResult.coaching;
        const coachingText = [
          coaching.strengths.length > 0
            ? `【強み】\n${coaching.strengths.map((s) => `・${s}`).join("\n")}`
            : "",
          coaching.improvements.length > 0
            ? `【改善点】\n${coaching.improvements.map((s) => `・${s}`).join("\n")}`
            : "",
          coaching.algorithmTips.length > 0
            ? `【アルゴリズム最適化】\n${coaching.algorithmTips.map((s) => `・${s}`).join("\n")}`
            : "",
          coaching.engagementPrediction
            ? `【エンゲージメント予測】\n${coaching.engagementPrediction}`
            : "",
          qualityCheckResult.summary
            ? `【品質チェック】\n${qualityCheckResult.summary}`
            : "",
        ]
          .filter(Boolean)
          .join("\n\n");

        // Save draft to database
        const draft = await prisma.draft.create({
          data: {
            userId,
            ideaId: ideaId || null,
            content: genResult.content,
            llmProvider: providerName,
            llmModel: genResult.model,
            qualityScore: compositeScore,
            engagementScore: genResult.scores.engagement,
            clarityScore: genResult.scores.clarity,
            hookScore: genResult.scores.hook,
            replyPotential: genResult.scores.replyPotential,
            controversyRisk: genResult.scores.controversyRisk,
            coachingAdvice: coachingText,
            tone,
            targetAudience,
            hashtags: genResult.hashtags.join(","),
            charCount: genResult.content.length,
          },
        });

        drafts.push({
          id: draft.id,
          content: genResult.content,
          provider: providerName,
          model: genResult.model,
          qualityScore: compositeScore,
          engagementScore: genResult.scores.engagement,
          clarityScore: genResult.scores.clarity,
          hookScore: genResult.scores.hook,
          replyPotential: genResult.scores.replyPotential,
          controversyRisk: genResult.scores.controversyRisk,
          coachingAdvice: coachingText,
          hashtags: genResult.hashtags.join(","),
          charCount: genResult.content.length,
        });
      } else {
        console.error(
          `Provider generation failed:`,
          result.reason
        );
      }
    }

    if (drafts.length === 0) {
      return NextResponse.json(
        { error: "全てのプロバイダーで生成に失敗しました。APIキーとネットワーク接続を確認してください。" },
        { status: 500 }
      );
    }

    // Sort drafts by quality score descending
    drafts.sort((a, b) => b.qualityScore - a.qualityScore);

    return NextResponse.json({ drafts });
  } catch (error) {
    console.error("POST /api/generate error:", error);
    return NextResponse.json(
      { error: "生成処理に失敗しました" },
      { status: 500 }
    );
  }
}
