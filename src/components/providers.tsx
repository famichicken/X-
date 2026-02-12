"use client";

import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/X-/sw.js").catch(() => {});
    }
  }, []);

  return (
    <SessionProvider>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#18181b",
            color: "#fafafa",
            borderRadius: "8px",
            fontSize: "14px",
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#fafafa",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fafafa",
            },
          },
        }}
      />
    </SessionProvider>
  );
}
