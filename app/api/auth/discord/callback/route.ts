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
    // Exchange code for access token
    const tokenData = await exchangeCodeForToken(code);
    
    // Get user information
    const discordUser = await getDiscordUser(tokenData.access_token);

    // Create session object
    const session: Session = {
      user: discordUser,
      accessToken: tokenData.access_token,
      expiresAt: Date.now() + tokenData.expires_in * 1000,
    };

    // Redirect to signin page with session data
    const redirectUrl = new URL('/signin', request.url);
    redirectUrl.searchParams.set('session', encodeURIComponent(JSON.stringify(session)));
    
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('Discord OAuth error:', error);
    return NextResponse.redirect(new URL('/signin?error=oauth_failed', request.url));
  }
}