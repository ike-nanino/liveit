"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const SESSION_MS     = 10 * 60 * 1000; // 10 minutes hard limit
const WARNING_BEFORE =  2 * 60 * 1000; // warn 2 minutes before

async function performSignOut(router: ReturnType<typeof useRouter>) {
  try {
    await fetch("/api/session", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ action: "destroy" }),
    });
    const { auth }    = await import("@/lib/firebase");
    const { signOut } = await import("firebase/auth");
    await signOut(auth);
  } catch {
    // Even if the request fails, still redirect
  } finally {
    router.push("/sign-in");
  }
}

export function useSessionTimeout() {
  const router          = useRouter();
  const logoutTimer     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningTimer    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownToast  = useRef<string | number | null>(null);
  const countdownInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearAll = useCallback(() => {
    if (logoutTimer.current)       clearTimeout(logoutTimer.current);
    if (warningTimer.current)      clearTimeout(warningTimer.current);
    if (countdownInterval.current) clearInterval(countdownInterval.current);
    logoutTimer.current       = null;
    warningTimer.current      = null;
    countdownInterval.current = null;
  }, []);

  useEffect(() => {
    // Read when the session was created
    const createdCookie = document.cookie
      .split("; ")
      .find(row => row.startsWith("session_created="))
      ?.split("=")[1];

    // If no session cookie found at all, sign out immediately
    if (!createdCookie) {
      performSignOut(router);
      return;
    }

    const createdAt = parseInt(createdCookie);
    const elapsed   = Date.now() - createdAt;
    const remaining = SESSION_MS - elapsed;

    // Already expired — sign out immediately
    if (remaining <= 0) {
      performSignOut(router);
      return;
    }

    const warningIn = remaining - WARNING_BEFORE;

    // Schedule the warning toast with a live countdown
    if (warningIn > 0) {
      warningTimer.current = setTimeout(() => {

        // Show initial warning
        toast.warning("Session expiring in 2 minutes", {
          description: "You will be signed out automatically for security. Please save any work.",
          duration:    WARNING_BEFORE,
        });

        // Live countdown every 30 seconds
        let secondsLeft = Math.floor(WARNING_BEFORE / 1000);
        countdownInterval.current = setInterval(() => {
          secondsLeft -= 30;
          if (secondsLeft <= 0) {
            if (countdownInterval.current) clearInterval(countdownInterval.current);
            return;
          }
          toast.warning(`Session expiring in ${secondsLeft} seconds`, {
            description: "You will be signed out automatically for security.",
            duration:    30_000,
          });
        }, 30_000);

      }, warningIn);
    } else {
      // Less than 2 minutes remaining on load — show warning immediately
      const secondsLeft = Math.floor(remaining / 1000);
      toast.warning(`Session expiring in ${secondsLeft} seconds`, {
        description: "You will be signed out automatically for security.",
        duration:    remaining,
      });
    }

    // Hard logout — no extension possible
    logoutTimer.current = setTimeout(async () => {
      clearAll();
      toast.error("Session expired", {
        description: "You have been signed out for security. Please sign in again.",
        duration:    4000,
      });
      await performSignOut(router);
    }, remaining);

    return clearAll;
  }, [router, clearAll]);
}