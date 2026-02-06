import { useEffect } from "react";
import { useSessionStore } from "@/states/sessionStore";

/**
 * A hook to access the current session from the client side.
 * Uses a global Zustand store to cache the session and prevent redundant API calls.
 */
export function useSession() {
  const { session, loading, fetchSession } = useSessionStore();

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  return {
    session,
    loading,
    isLoggedIn: !!session,
    user: session?.user,
  };
}
