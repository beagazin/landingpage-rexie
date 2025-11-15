// lib/auth.ts
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

// Client-side session management with cookies
export function saveSession(session: Session): void {
  if (typeof window !== 'undefined') {
    // Save to cookie with secure settings
    const cookieValue = encodeURIComponent(JSON.stringify(session));
    const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds
    
    // Set cookie with security flags
    document.cookie = `discord_session=${cookieValue}; max-age=${maxAge}; path=/; samesite=strict${window.location.protocol === 'https:' ? '; secure' : ''}`;
  }
}

export function getSession(): Session | null {
  if (typeof window === 'undefined') return null;
  
  // Get session from cookie
  const cookies = document.cookie.split(';');
  const sessionCookie = cookies.find(cookie => cookie.trim().startsWith('discord_session='));
  
  if (!sessionCookie) return null;

  try {
    const cookieValue = sessionCookie.split('=')[1];
    const session: Session = JSON.parse(decodeURIComponent(cookieValue));
    
    // Check if session is expired
    if (Date.now() >= session.expiresAt) {
      clearSession();
      return null;
    }

    return session;
  } catch (error) {
    console.error('Error parsing session cookie:', error);
    clearSession();
    return null;
  }
}

export function clearSession(): void {
  if (typeof window !== 'undefined') {
    // Clear cookie by setting expired date
    document.cookie = 'discord_session=; max-age=0; path=/; samesite=strict';
  }
}