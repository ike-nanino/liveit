// app/api/session/route.ts
import { NextRequest, NextResponse } from 'next/server';

const SESSION_DURATION = 10 * 60; // 10 minutes in seconds

export async function POST(req: NextRequest) {
  const { action } = await req.json();

  if (action === 'create') {
    const response = NextResponse.json({ success: true });
    response.cookies.set('session', 'authenticated', {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   SESSION_DURATION,
      path:     '/',
    });
    // Also store when the session was created so the client can countdown
    response.cookies.set('session_created', String(Date.now()), {
      httpOnly: false, // client needs to read this one
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   SESSION_DURATION,
      path:     '/',
    });
    return response;
  }

  if (action === 'destroy') {
    const response = NextResponse.json({ success: true });
    response.cookies.delete('session');
    response.cookies.delete('session_created');
    return response;
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}