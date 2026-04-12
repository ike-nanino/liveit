// components/SessionGuard.tsx
"use client";

import { useSessionTimeout } from "@/hooks/useSessionTimeout";

export default function SessionGuard({ children }: { children: React.ReactNode }) {
  useSessionTimeout();
  return <>{children}</>;
}