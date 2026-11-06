import { useEffect, useRef, useState } from "react";

import { getCurrentVersionName } from "@/utils/pages/details/currentVersion";
import genomicsService from "@/utils/services/genomics";
import { getMainSpeciesShortName } from "@/utils/species";

/**
 * Resolves the deployment main species' short name from the API assemblies.
 * Fetches only when `enabled` (e.g. a dialog is open); returns undefined while
 * loading, or when the version has no assembly for the main species.
 */
export const useMainSpeciesShortName = (enabled: boolean) => {
  const [shortName, setShortName] = useState<string>();
  const requested = useRef(false);

  useEffect(() => {
    if (!enabled || requested.current) return;
    requested.current = true;
    let cancelled = false;

    (async () => {
      try {
        const version = await getCurrentVersionName();
        if (!version) return;
        const { fetchVersionDetail } = genomicsService();
        const detail = await fetchVersionDetail(version);
        const name = getMainSpeciesShortName(detail.data.assemblies);
        if (!cancelled) setShortName(name);
      } catch (err) {
        console.error("Failed to fetch the main species short name:", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return shortName;
};

export default useMainSpeciesShortName;
