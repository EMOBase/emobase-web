import { useCallback } from "react";

import { apiFetch } from "@/utils/apiFetch";
import { useSessionStore } from "@/states/sessionStore";

/* Api fetch with jwt access token attached */
const useApiFetch = () => {
  return useCallback(async <T>(...params: Parameters<typeof apiFetch<T>>) => {
    const { session: currentSession } = useSessionStore.getState();

    if (currentSession?.user?.accessToken) {
      if (!params[2]) params[2] = {};
      const opts = params[2];
      opts.authorization = `Bearer ${currentSession.user.accessToken}`;
    }

    return await apiFetch<T>(...params);
  }, []);
};

export default useApiFetch;
