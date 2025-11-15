"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "./logo";
import { getSession, clearSession, getAvatarUrl, Session } from "@/lib/auth";

export default function Header() {
  const [session, setSession] = useState<Session | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Check for session on mount
    const checkSession = () => {
      const currentSession = getSession();
      setSession(currentSession);
    };
    
    checkSession();

    // Listen for storage changes (for multi-tab sync)
    const handleStorageChange = () => {
      checkSession();
    };

    // Listen for custom session update event
    const handleSessionUpdate = () => {
      checkSession();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('session-updated', handleSessionUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('session-updated', handleSessionUpdate);
    };
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsLoggingOut(true);
    
    // Smooth animation before logout
    setTimeout(() => {
      clearSession();
      setSession(null);
      setIsDropdownOpen(false);
      setIsLoggingOut(false);
      router.push('/');
    }, 800); // Wait for animation
  };

  return (
    <header className="z-30 mt-2 w-full md:mt-5">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative flex h-14 items-center justify-between gap-3 rounded-2xl bg-gray-900/90 px-3 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,var(--color-gray-800),var(--color-gray-700),var(--color-gray-800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] after:absolute after:inset-0 after:-z-10 after:backdrop-blur-xs">
          {/* Site branding */}
          <div className="flex flex-1 items-center">
            <Logo />
          </div>

          {/* Desktop sign in links / User menu */}
          <ul className="flex flex-1 items-center justify-end gap-3">
            {session ? (
              <>
                <li>
                  <Link
                    href="/dashboard"
                    className="btn-sm bg-linear-to-t from-[#9c6dfc] to-[#b896fc] bg-[length:100%_100%] bg-[bottom] py-[5px] text-white shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.16)] hover:bg-[length:100%_150%] transition-all duration-300 hover:shadow-[0_0_20px_rgba(156,109,252,0.5)]"
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 transition-all duration-300 hover:bg-[rgba(156,109,252,0.1)] border border-transparent hover:border-[rgba(156,109,252,0.3)]"
                  >
                    <Image
                      src={getAvatarUrl(session.user)}
                      alt={session.user.username}
                      width={32}
                      height={32}
                      className="rounded-full ring-2 ring-[#9c6dfc]/30"
                    />
                    <span className="text-sm font-medium text-gray-200">
                      {session.user.username}
                    </span>
                    <svg
                      className={`h-4 w-4 text-[#9c6dfc] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-[rgba(156,109,252,0.3)] bg-gray-900/95 backdrop-blur-sm shadow-[0_0_30px_rgba(156,109,252,0.2)] animate-[fadeIn_0.2s_ease-out]">
                      <div className="p-2">
                        <button
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-300 transition-all duration-300 hover:bg-[rgba(156,109,252,0.15)] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoggingOut ? (
                            <>
                              <svg
                                className="h-4 w-4 animate-spin text-[#9c6dfc]"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              <span>Desconectando...</span>
                            </>
                          ) : (
                            <>
                              <svg
                                className="h-4 w-4 text-[#9c6dfc]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                              </svg>
                              <span>Desconectar</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/signin"
                    className="btn-sm bg-linear-to-t from-[#9c6dfc] to-[#b896fc] bg-[length:100%_100%] bg-[bottom] py-[5px] text-white shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.16)] hover:bg-[length:100%_150%] transition-all duration-300 hover:shadow-[0_0_20px_rgba(156,109,252,0.5)]"
                  >
                    Acessar
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
}