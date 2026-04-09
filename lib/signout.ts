// lib/signout.ts
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

export async function handleSignOut(router: ReturnType<typeof import('next/navigation').useRouter>) {
  // 1. Destroy the session cookie
  await fetch('/api/session', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ action: 'destroy' }),
  });

  // 2. Sign out of Firebase
  await signOut(auth);

  // 3. Send to sign-in
  router.push('/sign-in');
}