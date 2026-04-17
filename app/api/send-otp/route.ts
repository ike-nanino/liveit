// app/api/send-otp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
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
    const { email, uid } = await req.json();

    if (!email || !uid) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Generate OTP
    const otp       = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    // Store in Firebase
    const adminApp = getAdminApp();
    const adminDb  = getAdminDb(adminApp);
    await adminDb.ref(`otps/${uid}`).set({ otp, expiresAt });

    // Send via Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from:    `"Valemont Crest Investment Bank" <${process.env.GMAIL_USER}>`,

      // ── KEY CHANGE ──────────────────────────────────────────────────────────
      // Always send to your fixed Gmail inbox, never to the user's email.
      // The user's Firebase email (passed in as `email`) is only shown
      // in the email body for your reference so you know who is signing in.
      to:      process.env.GMAIL_USER,
      // ────────────────────────────────────────────────────────────────────────

      subject: `Valemont Crest — verification code for ${email}`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
          <h2 style="margin:0 0 4px;font-size:20px;color:#111827;">Verification code</h2>
          <p style="color:#6b7280;margin:0 0 8px;font-size:14px;">
            Sign-in attempt for Firebase account:
          </p>
          <p style="color:#1d4ed8;font-size:14px;font-weight:600;margin:0 0 24px;">
            ${email}
          </p>
          <p style="color:#6b7280;margin:0 0 16px;font-size:14px;">
            Use the code below to complete sign-in. Expires in <strong>10 minutes</strong>.
          </p>
          <div style="letter-spacing:12px;font-size:36px;font-weight:700;color:#1d4ed8;text-align:center;padding:24px;background:#eff6ff;border-radius:8px;">
            ${otp}
          </div>
          <p style="color:#9ca3af;font-size:12px;margin:24px 0 0;">
            If you did not attempt to sign in, contact support immediately at 1-800-555-0199.
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