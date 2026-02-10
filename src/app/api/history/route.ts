import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const confirmSchema = z.object({
  draftId: z.string().optional(),
  content: z.string().min(1),
  llmProvider: z.string().min(1),
  llmModel: z.string().min(1),
  qualityScore: z.number().min(0).max(1).default(0),
  engagementScore: z.number().min(0).max(1).default(0),
  coachingAdvice: z.string().default(""),
  ideaId: z.string().optional(),
});

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

    const posts = await prisma.post.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("GET /api/history error:", error);
    return NextResponse.json(
      { error: "履歴の取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getSessionUser();
    if (!userId) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = confirmSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "入力データが不正です", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const {
      draftId,
      content,
      llmProvider,
      llmModel,
      qualityScore,
      engagementScore,
      coachingAdvice,
      ideaId,
    } = parsed.data;

    // Create the post record
    const post = await prisma.post.create({
      data: {
        userId,
        draftId: draftId || null,
        ideaId: ideaId || null,
        content,
        llmProvider,
        llmModel,
        qualityScore,
        engagementScore,
        coachingAdvice,
        status: "confirmed",
      },
    });

    // Mark the draft as selected if draftId is provided
    if (draftId) {
      await prisma.draft.update({
        where: { id: draftId },
        data: { isSelected: true },
      });
    }

    // Mark the idea as used if ideaId is provided
    if (ideaId) {
      await prisma.idea.update({
        where: { id: ideaId },
        data: { status: "used" },
      });
    }

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("POST /api/history error:", error);
    return NextResponse.json(
      { error: "投稿の確定に失敗しました" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getSessionUser();
    if (!userId) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "IDが必要です" },
        { status: 400 }
      );
    }

    const existing = await prisma.post.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "投稿が見つかりません" },
        { status: 404 }
      );
    }

    await prisma.post.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/history error:", error);
    return NextResponse.json(
      { error: "投稿の削除に失敗しました" },
      { status: 500 }
    );
  }
}
