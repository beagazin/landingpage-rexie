"use client";

import { useEffect, useState } from "react";
import { getSession, Session } from "@/lib/auth";
import Image from "next/image";
import { getAvatarUrl } from "@/lib/auth";

export default function Dashboard() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    setSession(getSession());
  }, []);

  if (!session) {
    return null;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      {/* Welcome Section */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <Image
            src={getAvatarUrl(session.user)}
            alt={session.user.username}
            width={64}
            height={64}
            className="rounded-full border-2 border-[#9c6dfc] shadow-[0_0_20px_rgba(156,109,252,0.3)]"
          />
          <div>
            <h1 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),#b896fc,var(--color-gray-50),#9c6dfc,var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              Bem-vindo, {session.user.username}!
            </h1>
            <p className="text-gray-400">
              Este é o seu painel de controle personalizado
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
        <div className="rounded-2xl bg-linear-to-br from-gray-900/50 via-gray-800/25 to-gray-900/50 p-6 backdrop-blur-xs before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,var(--color-gray-800),var(--color-gray-700),var(--color-gray-800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)]">
          <div className="mb-2 text-sm text-indigo-200/65">Total de Projetos</div>
          <div className="text-3xl font-bold text-gray-200">12</div>
        </div>

        <div className="rounded-2xl bg-linear-to-br from-gray-900/50 via-gray-800/25 to-gray-900/50 p-6 backdrop-blur-xs before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,var(--color-gray-800),var(--color-gray-700),var(--color-gray-800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)]">
          <div className="mb-2 text-sm text-indigo-200/65">Tarefas Ativas</div>
          <div className="text-3xl font-bold text-gray-200">8</div>
        </div>

        <div className="rounded-2xl bg-linear-to-br from-gray-900/50 via-gray-800/25 to-gray-900/50 p-6 backdrop-blur-xs before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,var(--color-gray-800),var(--color-gray-700),var(--color-gray-800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)]">
          <div className="mb-2 text-sm text-indigo-200/65">Concluídas</div>
          <div className="text-3xl font-bold text-gray-200">24</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-2xl bg-linear-to-br from-gray-900/50 via-gray-800/25 to-gray-900/50 p-8 backdrop-blur-xs before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,var(--color-gray-800),var(--color-gray-700),var(--color-gray-800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)]">
        <h2 className="mb-6 text-2xl font-semibold text-gray-200">
          Atividade Recente
        </h2>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex items-center gap-4 rounded-lg border border-gray-700/50 bg-gray-800/30 p-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-200">
                  Projeto #{item} atualizado
                </div>
                <div className="text-xs text-indigo-200/65">Há 2 horas</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}