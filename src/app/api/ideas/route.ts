import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createIdeaSchema = z.object({
  content: z.string().min(1, "内容を入力してください").max(1000),
  category: z.string().default("general"),
  tags: z.string().default(""),
  priority: z.number().int().min(0).max(10).default(0),
});

const updateIdeaSchema = z.object({
  id: z.string().min(1),
  content: z.string().min(1).max(1000).optional(),
  category: z.string().optional(),
  tags: z.string().optional(),
  priority: z.number().int().min(0).max(10).optional(),
  status: z.enum(["active", "used", "archived"]).optional(),
  sortOrder: z.number().int().optional(),
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

    if (!prisma) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const ideas = await prisma.idea.findMany({
      where: { userId },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ ideas });
  } catch (error) {
    console.error("GET /api/ideas error:", error);
    return NextResponse.json(
      { error: "アイデアの取得に失敗しました" },
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

    if (!prisma) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const body = await request.json();
    const parsed = createIdeaSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "入力データが不正です", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { content, category, tags, priority } = parsed.data;

    const maxSortOrder = await prisma.idea.aggregate({
      where: { userId },
      _max: { sortOrder: true },
    });

    const idea = await prisma.idea.create({
      data: {
        userId,
        content,
        category,
        tags,
        priority,
        sortOrder: (maxSortOrder._max.sortOrder ?? 0) + 1,
      },
    });

    return NextResponse.json({ idea }, { status: 201 });
  } catch (error) {
    console.error("POST /api/ideas error:", error);
    return NextResponse.json(
      { error: "アイデアの作成に失敗しました" },
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

    if (!prisma) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const body = await request.json();
    const parsed = updateIdeaSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "入力データが不正です", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { id, ...updateData } = parsed.data;

    const existing = await prisma.idea.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "アイデアが見つかりません" },
        { status: 404 }
      );
    }

    const idea = await prisma.idea.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ idea });
  } catch (error) {
    console.error("PUT /api/ideas error:", error);
    return NextResponse.json(
      { error: "アイデアの更新に失敗しました" },
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

    if (!prisma) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "IDが必要です" },
        { status: 400 }
      );
    }

    const existing = await prisma.idea.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "アイデアが見つかりません" },
        { status: 404 }
      );
    }

    await prisma.idea.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/ideas error:", error);
    return NextResponse.json(
      { error: "アイデアの削除に失敗しました" },
      { status: 500 }
    );
  }
}
