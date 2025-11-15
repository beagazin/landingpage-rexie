// hooks/useAuth.ts
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, clearSession, Session } from '@/lib/auth';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Initial session check
    const currentSession = getSession();
    setSession(currentSession);
    setIsLoading(false);

    // Listen for storage changes (multi-tab sync via cookies)
    const handleStorageChange = (e: StorageEvent) => {
      // For cookies, we check on focus/visibility change
      const newSession = getSession();
      setSession(newSession);
      
      // If session was cleared, redirect to home
      if (!newSession && window.location.pathname.startsWith('/dashboard')) {
        router.push('/');
      }
    };

    // Also listen for visibility changes to sync cookies
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const newSession = getSession();
        setSession(newSession);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [router]);

  const logout = () => {
    clearSession();
    setSession(null);
    router.push('/');
  };

  const isAuthenticated = !!session;

  return {
    session,
    isLoading,
    isAuthenticated,
    logout,
    user: session?.user ?? null,
  };
}