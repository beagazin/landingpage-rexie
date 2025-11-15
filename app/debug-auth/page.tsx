"use client";

import { getDiscordOAuthURL } from "@/lib/auth";

export default function DebugAuth() {
  const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI;
  const oauthUrl = getDiscordOAuthURL();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-white">
        Debug - Configuração Discord OAuth
      </h1>

      <div className="space-y-6 rounded-lg bg-gray-800 p-6">
        <div>
          <h2 className="mb-2 text-lg font-semibold text-gray-200">
            1. Client ID
          </h2>
          <div className="rounded bg-gray-900 p-3">
            <code className="text-sm text-green-400">
              {clientId || '❌ NÃO CONFIGURADO'}
            </code>
          </div>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold text-gray-200">
            2. Redirect URI
          </h2>
          <div className="rounded bg-gray-900 p-3">
            <code className="text-sm text-green-400">
              {redirectUri || '❌ NÃO CONFIGURADO'}
            </code>
          </div>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold text-gray-200">
            3. URL OAuth Completa
          </h2>
          <div className="rounded bg-gray-900 p-3">
            <code className="break-all text-xs text-blue-400">
              {oauthUrl}
            </code>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-200">
            ✅ Checklist
          </h2>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className={clientId ? '✅' : '❌'}>
              {clientId ? '✅' : '❌'} Client ID configurado no .env.local
            </li>
            <li className={redirectUri ? '✅' : '❌'}>
              {redirectUri ? '✅' : '❌'} Redirect URI configurado no .env.local
            </li>
            <li>
              ⚠️ Verifique se a Redirect URI no Discord Developer Portal é EXATAMENTE:
              <div className="mt-2 rounded bg-yellow-900/20 p-2">
                <code className="text-yellow-400">
                  http://localhost:3000/api/auth/discord/callback
                </code>
              </div>
            </li>
            <li>
              ⚠️ Certifique-se de ter clicado em <strong>"Save Changes"</strong> no Discord
            </li>
          </ul>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-200">
            🔧 Passos para Corrigir
          </h2>
          <ol className="list-decimal space-y-2 pl-6 text-sm text-gray-300">
            <li>Acesse https://discord.com/developers/applications</li>
            <li>Selecione sua aplicação</li>
            <li>Vá em OAuth2 → General</li>
            <li>Em "Redirects", adicione: <code className="text-green-400">http://localhost:3000/api/auth/discord/callback</code></li>
            <li>Role até o final e clique em "Save Changes"</li>
            <li>Aguarde 1-2 minutos para propagar</li>
            <li>Reinicie o servidor Next.js: <code>Ctrl+C</code> e <code>pnpm dev</code></li>
          </ol>
        </div>
      </div>

      <div className="mt-6 text-center">
        <a
          href="/signin"
          className="inline-block rounded-lg bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700"
        >
          Voltar para Login
        </a>
      </div>
    </div>
  );
}