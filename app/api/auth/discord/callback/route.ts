// app/api/auth/discord/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken, getDiscordUser, Session } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL('/signin?error=access_denied', request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/signin?error=no_code', request.url));
  }

  try {
    console.log('=== Discord OAuth Callback ===');
    console.log('Code received:', code.substring(0, 10) + '...');
    console.log('Client ID:', process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID);
    console.log('Client Secret exists:', !!process.env.DISCORD_CLIENT_SECRET);
    console.log('Redirect URI:', process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI);
    
    // Exchange code for access token
    const tokenData = await exchangeCodeForToken(code);
    console.log('Token exchange successful');
    
    // Get user information
    const discordUser = await getDiscordUser(tokenData.access_token);
    console.log('User fetched:', discordUser.username);

    // Create session object
    const session: Session = {
      user: discordUser,
      accessToken: tokenData.access_token,
      expiresAt: Date.now() + tokenData.expires_in * 1000,
    };

    // Create redirect URL with session data embedded
    const redirectUrl = new URL('/signin/callback', request.url);
    redirectUrl.searchParams.set('session', encodeURIComponent(JSON.stringify(session)));
    
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('Discord OAuth error:', error);
    return NextResponse.redirect(new URL('/signin?error=oauth_failed', request.url));
  }
}