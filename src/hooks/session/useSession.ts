import { signIn, signOut } from "auth-astro/client";

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
