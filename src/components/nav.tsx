"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Twitter, Lightbulb, Sparkles, History, Settings, LogIn, LogOut } from "lucide-react";

const navItems = [
  { href: "/ideas", icon: Lightbulb, label: "ネタ帳" },
  { href: "/generate", icon: Sparkles, label: "AI生成" },
  { href: "/history", icon: History, label: "履歴" },
  { href: "/settings", icon: Settings, label: "設定" },
];

export function Nav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <nav className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-950">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <Twitter className="h-6 w-6 text-neutral-900 dark:text-neutral-100" />
        <span className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
          X Post Generator
        </span>
      </Link>

      {/* Nav items */}
      <div className="flex items-center gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "gap-2",
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

      {/* Auth */}
      <div>
        {session ? (
          <Button variant="ghost" size="sm" onClick={() => signOut()}>
            <LogOut className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">ログアウト</span>
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
