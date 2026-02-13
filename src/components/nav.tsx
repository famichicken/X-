"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Lightbulb, Sparkles, History, Settings, LogIn, LogOut, Heart, Flame } from "lucide-react";
import { useAuth } from "@/lib/guest";

const navItems = [
  { href: "/ideas", icon: Lightbulb, label: "ネタ帳" },
  { href: "/generate", icon: Sparkles, label: "AI生成" },
  { href: "/reference", icon: Flame, label: "バズ分析" },
  { href: "/engage", icon: Heart, label: "エンゲージ" },
  { href: "/history", icon: History, label: "履歴" },
  { href: "/settings", icon: Settings, label: "設定" },
];

// X logo component
function XLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function Nav() {
  const pathname = usePathname();
  const { isAuthenticated, isGuest, exitGuestMode } = useAuth();

  const handleLogout = () => {
    if (isGuest) {
      exitGuestMode();
    } else {
      signOut();
    }
  };

  return (
    <nav className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-950">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <XLogo className="h-5 w-5 text-neutral-900 dark:text-neutral-100" />
        <span className="hidden text-lg font-bold text-neutral-900 dark:text-neutral-100 sm:inline">
          X Post Generator
        </span>
      </Link>

      {/* Nav items - show when authenticated */}
      {isAuthenticated && (
        <div className="flex items-center gap-0.5 sm:gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "gap-1 px-2 sm:gap-2 sm:px-3",
                    isActive && "bg-neutral-100 dark:bg-neutral-800"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </div>
      )}

      {/* Auth */}
      <div>
        {isAuthenticated ? (
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">
              {isGuest ? "終了" : "ログアウト"}
            </span>
          </Button>
        ) : (
          <Button variant="ghost" size="sm" onClick={() => signIn("twitter")}>
            <LogIn className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">ログイン</span>
          </Button>
        )}
      </div>
    </nav>
  );
}
