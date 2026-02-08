import { useEffect } from "react";
import { signIn, signOut } from "auth-astro/client";

import { parseISO, isBefore, addMinutes } from "date-fns";

import { useSessionStore } from "@/states/sessionStore";

/**
 * A hook to access the current session from the client side.
 * Uses a global Zustand store to cache the session and prevent redundant API calls.
 */
export function useSession() {
  const { session, loading, fetchSession } = useSessionStore();

  const refresh = () => {
    fetchSession(true);
  };

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  useEffect(() => {
    if (session?.error) {
      logout();
      return;
    }

    const handleFocus = () => {
      // Logout user if token has expired
      if (session && isBefore(parseISO(session.expires), Date.now())) {
        logout();
      }
    };

    window.addEventListener("focus", handleFocus);

    const intervalId = setInterval(() => {
      // Refresh token if it will expire in 1 min
      if (
        session &&
        isBefore(parseISO(session.expires), addMinutes(Date.now(), 1))
      ) {
        refresh();
      }
    }, 1000 * 30);

    return () => {
      window.removeEventListener("focus", handleFocus);
      clearInterval(intervalId);
    };
  }, [session, fetchSession]);

  const login = () => signIn("keycloak");

  const logout = () =>
    signOut().then(() => {
      if (window.location.pathname.startsWith("/admin")) {
        window.location.href = "/";
      }
    });

  return {
    session,
    loading,
    isLoggedIn: !!session,
    user: session?.user,
    refresh,
    login,
    logout,
  };
}
