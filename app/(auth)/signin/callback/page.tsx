"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { saveSession } from "@/lib/auth";

export default function SignInCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const sessionParam = searchParams.get('session');
    
    if (sessionParam) {
      try {
        const session = JSON.parse(decodeURIComponent(sessionParam));
        saveSession(session);
        
        // Force a small delay to ensure localStorage is written
        setTimeout(() => {
          // Trigger a page reload to update all components
          window.location.href = '/';
        }, 100);
      } catch (err) {
        console.error('Error processing session:', err);
        router.push('/signin?error=oauth_failed');
      }
    } else {
      router.push('/signin?error=no_session');
    }
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
        <p className="text-lg text-gray-200">Finalizando autenticação...</p>
        <p className="mt-2 text-sm text-indigo-200/65">
          Você será redirecionado em instantes
        </p>
      </div>
    </div>
  );
}