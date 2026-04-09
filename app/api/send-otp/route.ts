// app/api/send-otp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getDatabase, ref, set } from 'firebase/database';
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getDatabase as getAdminDb } from 'firebase-admin/database';

// We use firebase-admin on the server side
// npm install firebase-admin nodemailer
// npm install -D @types/nodemailer

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
    const { email, uid } = await req.json();

    if (!email || !uid) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Generate a cryptographically random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // OTP expires in 10 minutes
    const expiresAt = Date.now() + 10 * 60 * 1000;

    // Store OTP in Firebase Realtime Database against the user's uid
    const adminApp = getAdminApp();
    const adminDb  = getAdminDb(adminApp);
    await adminDb.ref(`otps/${uid}`).set({ otp, expiresAt });

    // Send email via Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from:    `"SecureBank" <${process.env.GMAIL_USER}>`,
      to:      email,
      subject: 'Your SecureBank verification code',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
          <h2 style="margin:0 0 8px;font-size:20px;color:#111827;">Verification code</h2>
          <p style="color:#6b7280;margin:0 0 24px;font-size:14px;">
            Use the code below to complete your sign-in. It expires in <strong>10 minutes</strong>.
          </p>
          <div style="letter-spacing:12px;font-size:36px;font-weight:700;color:#1d4ed8;text-align:center;padding:24px;background:#eff6ff;border-radius:8px;">
            ${otp}
          </div>
          <p style="color:#9ca3af;font-size:12px;margin:24px 0 0;">
            If you didn't request this code, please contact support immediately at 1-800-555-0199.
            Never share this code with anyone.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('OTP send error:', err);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}