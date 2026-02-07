import { create } from "zustand";

export type Session = {
  user: {
    name: string;
    email: string;
    accessToken: string;
  };
  expires: string;
};

interface SessionState {
  session: Session | null;
  loading: boolean;
  isFetched: boolean;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  fetchSession: (force?: boolean) => Promise<void>;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  session: null,
  loading: true,
  isFetched: false,
  setSession: (session) => set({ session, isFetched: true }),
  setLoading: (loading) => set({ loading }),
  fetchSession: async (force = false) => {
    // If already fetched or loading, don't fetch again unless forced
    if (get().isFetched && !get().loading && !force) return;

    set({ loading: true });
    try {
      const res = await fetch("/api/auth/session");
      if (res.ok) {
        const session = await res.json();
        // Check if session is empty (Auth.js returns {} for unauthenticated)
        if (session && Object.keys(session).length > 0) {
          set({ session, isFetched: true });
        } else {
          set({ session: null, isFetched: true });
        }
      } else {
        set({ session: null, isFetched: true });
      }
    } catch (error) {
      console.error("Failed to fetch session:", error);
      set({ session: null, isFetched: true });
    } finally {
      set({ loading: false });
    }
  },
}));
