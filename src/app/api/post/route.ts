import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { z } from "zod";

const postSchema = z.object({
  content: z.string().min(1).max(280),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const accessToken = (session as unknown as Record<string, unknown>)
      .accessToken as string | undefined;
    if (!accessToken) {
      return NextResponse.json(
        { error: "Xアクセストークンがありません。再ログインしてください。" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = postSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "投稿内容が不正です" },
        { status: 400 }
      );
    }

    const res = await fetch("https://api.x.com/2/tweets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: parsed.data.content }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("X API error:", res.status, err);
      return NextResponse.json(
        {
          error:
            res.status === 403
              ? "投稿権限がありません。Xアプリの権限を確認してください。"
              : "Xへの投稿に失敗しました",
        },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json({
      success: true,
      tweetId: data.data?.id,
    });
  } catch (error) {
    console.error("POST /api/post error:", error);
    return NextResponse.json(
      { error: "投稿処理に失敗しました" },
      { status: 500 }
    );
  }
}
