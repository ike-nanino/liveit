import { NextRequest, NextResponse } from 'next/server';

const SESSION_DURATION = 10 * 60;

export async function POST(req: NextRequest) {
  try {
    const { action } = await req.json();

    if (action === 'create') {
      const response = NextResponse.json({ success: true });

      response.cookies.set({
        name:     'session',
        value:    'authenticated',
        httpOnly: true,
        secure:   process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge:   SESSION_DURATION,
        path:     '/',
      });

      response.cookies.set({
        name:     'session_created',
        value:    String(Date.now()),
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
      response.cookies.set({ name: 'session',         value: '', maxAge: 0, path: '/' });
      response.cookies.set({ name: 'session_created', value: '', maxAge: 0, path: '/' });
      return response;
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}