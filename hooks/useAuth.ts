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

    // Listen for storage changes (multi-tab sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'discord_session') {
        const newSession = getSession();
        setSession(newSession);
        
        // If session was cleared, redirect to home
        if (!newSession && window.location.pathname.startsWith('/dashboard')) {
          router.push('/');
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
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