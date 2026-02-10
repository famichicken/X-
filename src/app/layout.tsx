import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { Nav } from "@/components/nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "X Post Generator - AI投稿生成ツール",
  description:
    "AIを活用してXの投稿を生成・最適化するツール。エンゲージメントを最大化する投稿を簡単に作成できます。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="font-sans antialiased">
        <Providers>
          <Nav />
          <main className="min-h-screen">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
