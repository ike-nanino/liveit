// app/api/verify-otp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getDatabase as getAdminDb } from 'firebase-admin/database';

function getAdminApp() {
  if (getApps().length) return getApp();
  return initializeApp({
    credential: cert({
      projectId:   process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey:  process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  });
}

export async function POST(req: NextRequest) {
  try {
    const { uid, otp } = await req.json();

    if (!uid || !otp) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const adminApp = getAdminApp();
    const adminDb  = getAdminDb(adminApp);
    const snapshot = await adminDb.ref(`otps/${uid}`).get();

    if (!snapshot.exists()) {
      return NextResponse.json({ error: 'No OTP found. Please request a new code.' }, { status: 400 });
    }

    const { otp: storedOtp, expiresAt } = snapshot.val();

    if (Date.now() > expiresAt) {
      await adminDb.ref(`otps/${uid}`).remove();
      return NextResponse.json({ error: 'Code expired. Please sign in again.' }, { status: 400 });
    }

    if (otp !== storedOtp) {
      return NextResponse.json({ error: 'Incorrect code. Please try again.' }, { status: 400 });
    }

    // OTP matched — delete it so it can't be reused
    await adminDb.ref(`otps/${uid}`).remove();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('OTP verify error:', err);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}