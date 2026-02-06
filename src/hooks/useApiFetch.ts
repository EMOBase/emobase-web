import { useCallback } from "react";

import { apiFetch } from "@/utils/apiFetch";
import { useSession } from "@/hooks/session/useSession";

/* Api fetch with jwt access token attached */
const useApiFetch = () => {
  const { session } = useSession();

  return useCallback(
    async <T>(...params: Parameters<typeof apiFetch<T>>) => {
      if (session) {
        if (!params[2]) params[2] = {};
        const opts = params[2];
        opts.authorization = `Bearer ${session.user.accessToken}`;
      }

      return await apiFetch<T>(...params);
    },
    [session],
  );
};

export default useApiFetch;
