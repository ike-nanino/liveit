// app/api/session/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { action } = await req.json();

  if (action === 'create') {
    const response = NextResponse.json({ success: true });
    response.cookies.set('session', 'authenticated', {
      httpOnly: true,       // JS cannot read it — XSS safe
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   60 * 60 * 24 * 7, // 7 days
      path:     '/',
    });
    return response;
  }

  if (action === 'destroy') {
    const response = NextResponse.json({ success: true });
    response.cookies.delete('session');
    return response;
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}