// hooks/useSessionTimeout.ts
"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const SESSION_MS     = 10 * 60 * 1000;
const WARNING_BEFORE =  2 * 60 * 1000;

async function performSignOut(router: ReturnType<typeof useRouter>) {
  await fetch("/api/session", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ action: "destroy" }),
  });
  const { auth }    = await import("@/lib/firebase");
  const { signOut } = await import("firebase/auth");
  await signOut(auth);
  router.push("/sign-in");
}

export function useSessionTimeout() {
  const router         = useRouter();
  const logoutTimer    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Store startTimers in a ref so it can reference itself without
  // the circular dependency that useCallback causes
  const startTimersRef = useRef<(() => void) | null>(null);

  const clearTimers = useCallback(() => {
    if (logoutTimer.current)  clearTimeout(logoutTimer.current);
    if (warningTimer.current) clearTimeout(warningTimer.current);
    logoutTimer.current  = null;
    warningTimer.current = null;
  }, []);

  const startTimers = useCallback(() => {
    clearTimers();

    const createdCookie = document.cookie
      .split("; ")
      .find(row => row.startsWith("session_created="))
      ?.split("=")[1];

    const createdAt = createdCookie ? parseInt(createdCookie) : Date.now();
    const elapsed   = Date.now() - createdAt;
    const remaining = SESSION_MS - elapsed;

    if (remaining <= 0) {
      performSignOut(router);
      return;
    }

    const warningIn = remaining - WARNING_BEFORE;

    if (warningIn > 0) {
      warningTimer.current = setTimeout(() => {
        toast.warning("Session expiring soon", {
          description: "You will be automatically signed out in 2 minutes.",
          duration:    WARNING_BEFORE,
          action: {
            label:   "Stay signed in",
            onClick: async () => {
              await fetch("/api/session", {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({ action: "create" }),
              });
              // Call via ref — no circular dependency
              startTimersRef.current?.();
              toast.success("Session extended", {
                description: "You have been given another 10 minutes.",
              });
            },
          },
        });
      }, warningIn);
    }

    logoutTimer.current = setTimeout(async () => {
      toast.error("Session expired", {
        description: "You have been signed out for security. Please sign in again.",
        duration: 5000,
      });
      await performSignOut(router);
    }, remaining);

  }, [router, clearTimers]);

  // Keep the ref in sync with the latest version of startTimers
  useEffect(() => {
    startTimersRef.current = startTimers;
  }, [startTimers]);

  useEffect(() => {
    startTimers();
    return clearTimers;
  }, [startTimers, clearTimers]);
}