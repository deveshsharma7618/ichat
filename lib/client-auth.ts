"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export interface AuthUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  accessToken?: string;
  [key: string]: unknown;
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = localStorage.getItem("user");
    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored);
    if (parsed && parsed.email) {
      return parsed as AuthUser;
    }

    return null;
  } catch (error) {
    console.error("Error reading user from localStorage:", error);
    return null;
  }
}

type UseClientAuthOptions = {
  requireAuth?: boolean;
  redirectTo?: string;
};

export function useClientAuth(options: UseClientAuthOptions = {}) {
  const { requireAuth = false, redirectTo = "/" } = options;
  const { data: session, status } = useSession();
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);
  const [storageChecked, setStorageChecked] = useState(false);
  const [storedUser, setStoredUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    const user = getStoredUser();
    setStoredUser(user);
    setToken(localStorage.getItem("accessToken") || null);
    setStorageChecked(true);
  }, [isMounted, status, session?.user?.email]);

  useEffect(() => {
    if (!isMounted || !session?.user) {
      return;
    }

    const mergedUser = {
      ...(getStoredUser() ?? {}),
      ...session.user,
    };

    localStorage.setItem("user", JSON.stringify(mergedUser));
    setStoredUser(mergedUser);
  }, [isMounted, session?.user]);

  const user: AuthUser | null = useMemo(() => {
    if (storedUser && session?.user) {
      return { ...storedUser, ...session.user };
    }

    if (storedUser) {
      return storedUser;
    }

    return (session?.user as AuthUser | undefined) ?? null;
  }, [storedUser, session?.user]);

  const isLoading = !isMounted || !storageChecked || status === "loading";
  const isAuthenticated = !!user?.email;

  useEffect(() => {
    if (!requireAuth || isLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.push(redirectTo);
    }
  }, [requireAuth, isLoading, isAuthenticated, router, redirectTo]);

  return {
    user,
    token,
    status,
    isLoading,
    isAuthenticated,
  };
}

/**
 * Centralized logout function that clears all authentication data
 */
export async function handleLogout() {
  // Clear all localStorage items
  localStorage.removeItem("user");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("friends");
  localStorage.removeItem("userSettings");
  
  // Sign out from NextAuth session
  await signOut({ redirect: true, callbackUrl: "/" });
}
