import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/providers";
import { Nav } from "@/components/nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "X Post Generator - AI投稿生成ツール",
  description:
    "AIを活用してXの投稿を生成・最適化するツール。エンゲージメントを最大化する投稿を簡単に作成できます。",
  manifest: "/X-/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "X Post Gen",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="apple-touch-icon" href="/X-/icons/icon-192.png" />
      </head>
      <body className="font-sans antialiased" style={{ paddingTop: "env(safe-area-inset-top)" }}>
        <Providers>
          <Nav />
          <main className="min-h-screen">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
