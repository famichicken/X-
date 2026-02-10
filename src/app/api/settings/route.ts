import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const MASK = "••••••••";

const updateSettingsSchema = z.object({
  claudeApiKey: z.string().optional(),
  chatgptApiKey: z.string().optional(),
  geminiApiKey: z.string().optional(),
  grokApiKey: z.string().optional(),
  defaultLlm: z
    .enum(["claude", "chatgpt", "gemini", "grok"])
    .optional(),
  defaultTone: z.string().optional(),
  hashtagCount: z.number().int().min(0).max(10).optional(),
  emojiLimit: z.number().int().min(0).max(20).optional(),
  brandVoice: z.string().max(2000).optional(),
  ngWords: z.string().max(1000).optional(),
});

function maskApiKey(key: string | null): string {
  if (!key) return "";
  if (key.length <= 8) return MASK;
  return key.slice(0, 4) + MASK + key.slice(-4);
}

async function getSessionUser() {
  const session = await auth();
  if (!session?.user) return null;
  return (session.user as { id: string }).id;
}

export async function GET() {
  try {
    const userId = await getSessionUser();
    if (!userId) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const settings = await prisma.userSettings.findUnique({
      where: { userId },
    });

    if (!settings) {
      return NextResponse.json({
        settings: {
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
        },
      });
    }

    // Return settings with masked API keys
    return NextResponse.json({
      settings: {
        claudeApiKey: maskApiKey(settings.claudeApiKey),
        chatgptApiKey: maskApiKey(settings.chatgptApiKey),
        geminiApiKey: maskApiKey(settings.geminiApiKey),
        grokApiKey: maskApiKey(settings.grokApiKey),
        defaultLlm: settings.defaultLlm,
        defaultTone: settings.defaultTone,
        hashtagCount: settings.hashtagCount,
        emojiLimit: settings.emojiLimit,
        brandVoice: settings.brandVoice,
        ngWords: settings.ngWords,
      },
    });
  } catch (error) {
    console.error("GET /api/settings error:", error);
    return NextResponse.json(
      { error: "設定の取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = await getSessionUser();
    if (!userId) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = updateSettingsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "入力データが不正です", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Build update data, skipping masked API key values
    const updateData: Record<string, unknown> = {};

    // Only update API keys if the value is not the masked placeholder
    const apiKeyFields = [
      "claudeApiKey",
      "chatgptApiKey",
      "geminiApiKey",
      "grokApiKey",
    ] as const;

    for (const field of apiKeyFields) {
      const value = data[field];
      if (value !== undefined && !value.includes(MASK)) {
        updateData[field] = value;
      }
    }

    // Always update non-sensitive fields if provided
    if (data.defaultLlm !== undefined) updateData.defaultLlm = data.defaultLlm;
    if (data.defaultTone !== undefined)
      updateData.defaultTone = data.defaultTone;
    if (data.hashtagCount !== undefined)
      updateData.hashtagCount = data.hashtagCount;
    if (data.emojiLimit !== undefined) updateData.emojiLimit = data.emojiLimit;
    if (data.brandVoice !== undefined) updateData.brandVoice = data.brandVoice;
    if (data.ngWords !== undefined) updateData.ngWords = data.ngWords;

    const settings = await prisma.userSettings.upsert({
      where: { userId },
      update: updateData,
      create: {
        userId,
        ...updateData,
      },
    });

    return NextResponse.json({
      settings: {
        claudeApiKey: maskApiKey(settings.claudeApiKey),
        chatgptApiKey: maskApiKey(settings.chatgptApiKey),
        geminiApiKey: maskApiKey(settings.geminiApiKey),
        grokApiKey: maskApiKey(settings.grokApiKey),
        defaultLlm: settings.defaultLlm,
        defaultTone: settings.defaultTone,
        hashtagCount: settings.hashtagCount,
        emojiLimit: settings.emojiLimit,
        brandVoice: settings.brandVoice,
        ngWords: settings.ngWords,
      },
    });
  } catch (error) {
    console.error("PUT /api/settings error:", error);
    return NextResponse.json(
      { error: "設定の保存に失敗しました" },
      { status: 500 }
    );
  }
}
