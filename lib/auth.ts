export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  email?: string;
}

export interface Session {
  user: DiscordUser;
  accessToken: string;
  expiresAt: number;
}

const DISCORD_CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!;
const DISCORD_REDIRECT_URI = process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI || 'http://localhost:3000/api/auth/discord/callback';

// Construir URL do OAuth manualmente para garantir encoding correto
export const getDiscordOAuthURL = () => {
  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: DISCORD_REDIRECT_URI,
    response_type: 'code',
    scope: 'identify email',
  });
  
  return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
};

export const DISCORD_OAUTH_URL = getDiscordOAuthURL();

export async function exchangeCodeForToken(code: string): Promise<{ access_token: string; expires_in: number }> {
  const response = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: DISCORD_CLIENT_ID,
      client_secret: DISCORD_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code,
      redirect_uri: DISCORD_REDIRECT_URI,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to exchange code for token');
  }

  return response.json();
}

export async function getDiscordUser(accessToken: string): Promise<DiscordUser> {
  const response = await fetch('https://discord.com/api/users/@me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Discord user');
  }

  return response.json();
}

export function getAvatarUrl(user: DiscordUser): string {
  if (user.avatar) {
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
  }
  // Default avatar baseado no discriminator
  const defaultAvatarNum = parseInt(user.discriminator) % 5;
  return `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNum}.png`;
}

// Client-side session management
export function saveSession(session: Session): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('discord_session', JSON.stringify(session));
  }
}

export function getSession(): Session | null {
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem('discord_session');
  if (!stored) return null;

  const session: Session = JSON.parse(stored);
  
  // Check if session is expired
  if (Date.now() >= session.expiresAt) {
    clearSession();
    return null;
  }

  return session;
}

export function clearSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('discord_session');
  }
}