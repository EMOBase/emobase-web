import { useState, useEffect } from "react";
import type { DefaultSession } from "@auth/core/types";

/**
 * A hook to access the current session from the client side.
 * Useful for conditionally rendering UI components (like sidebars)
 * in static pages that are not pre-rendered with session data.
 */
export function useSession() {
  const [session, setSession] = useState<DefaultSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/auth/session");
        const s = await res.json();
        setSession(s);
      } catch (error) {
        console.error("Failed to fetch session:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

  return {
    session,
    loading,
    isLoggedIn: !!session,
    user: session?.user,
  };
}
