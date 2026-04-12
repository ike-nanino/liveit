import { NextRequest, NextResponse } from 'next/server';

const SESSION_DURATION = 10 * 60; // 10 minutes, hard limit

export async function POST(req: NextRequest) {
  const { action } = await req.json();

  if (action === 'create') {
    const response = NextResponse.json({ success: true });

    // Hard session cookie — expires in exactly 10 minutes, no renewal
    response.cookies.set('session', 'authenticated', {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   SESSION_DURATION,
      path:     '/',
    });

    // Readable by client for countdown — also hard 10 minutes
    response.cookies.set('session_created', String(Date.now()), {
      httpOnly: false,
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