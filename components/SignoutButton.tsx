'use client';

import { useRouter } from 'next/navigation';
import { handleSignOut } from '@/lib/signout';
import { LogOut } from 'lucide-react';

export function SignOutButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => handleSignOut(router)}
      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      <LogOut className="w-4 h-4" />
      {/* Sign out */}
    </button>
  );
}