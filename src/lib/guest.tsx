"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";

interface GuestContextType {
  isGuest: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  enterGuestMode: () => void;
  exitGuestMode: () => void;
}

const GuestContext = createContext<GuestContextType>({
  isGuest: false,
  isAuthenticated: false,
  isLoading: true,
  enterGuestMode: () => {},
  exitGuestMode: () => {},
});

export function GuestProvider({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const [isGuest, setIsGuest] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const guest = localStorage.getItem("guestMode");
    if (guest === "true") {
      setIsGuest(true);
    }
  }, []);

  const enterGuestMode = () => {
    localStorage.setItem("guestMode", "true");
    setIsGuest(true);
  };

  const exitGuestMode = () => {
    localStorage.removeItem("guestMode");
    setIsGuest(false);
  };

  const isAuthenticated = status === "authenticated" || isGuest;
  const isLoading = !mounted || (status === "loading" && !isGuest);

  return (
    <GuestContext.Provider value={{ isGuest, isAuthenticated, isLoading, enterGuestMode, exitGuestMode }}>
      {children}
    </GuestContext.Provider>
  );
}

export function useAuth() {
  return useContext(GuestContext);
}
