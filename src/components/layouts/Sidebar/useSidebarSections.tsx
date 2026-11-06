import { useEffect, useState } from "react";

import genomicsService from "@/utils/services/genomics";
import { getCurrentVersionName } from "@/utils/pages/details/currentVersion";
import { mainSpecies } from "@/utils/mainSpecies";
import { useSession } from "@/hooks/session/useSession";
import { useFavoriteGenes } from "@/states/favoriteGenes";
import {
  homeItems,
  toolItems,
  resourceItems,
  getActiveView,
} from "./constants";
import type { NavItem, NavItemChild } from "./types";
import { withVersionOverride } from "@/utils/version";

const GENOME_BROWSER_HREF = "/genomebrowser";

export const useSidebarSections = (url: string) => {
  const { isLoggedIn } = useSession();
  const { isLoading, getFavoriteGenes, unmarkFavorite } = useFavoriteGenes();
  const favoriteGenes = getFavoriteGenes();
  const activeView = getActiveView(url);

  // The genome browser lists every assembly in the shared JBrowse2 config.
  // Open it on the selected version's main-species assembly instead, the same
  // way a gene's "Genomic location" link does.
  const [genomeBrowserHref, setGenomeBrowserHref] =
    useState(GENOME_BROWSER_HREF);

  useEffect(() => {
    let cancelled = false;

    const resolveAssembly = async () => {
      try {
        const version = await getCurrentVersionName();
        if (!version) return;

        const { fetchVersionDetail } = genomicsService();
        const detail = await fetchVersionDetail(version);
        const assembly = detail.data.assemblies.find(
          (item) => item.speciesCode === mainSpecies,
        );
        if (!assembly || cancelled) return;

        const assemblyKey = `v${detail.data.id}a${assembly.id}`;
        setGenomeBrowserHref(
          `${GENOME_BROWSER_HREF}?assembly=${encodeURIComponent(assemblyKey)}`,
        );
      } catch (err) {
        console.error("Failed to resolve the genome browser assembly:", err);
      }
    };

    void resolveAssembly();

    // The sidebar persists across view transitions, so resolve again after
    // each navigation (including a version override in the URL).
    document.addEventListener("astro:page-load", resolveAssembly);
    return () => {
      cancelled = true;
      document.removeEventListener("astro:page-load", resolveAssembly);
    };
  }, []);

  const toolItemsWithGenomeBrowser = toolItems.map((item) =>
    item.id === "GENOME_BROWSER" ? { ...item, href: genomeBrowserHref } : item,
  );

  const homeItemsWithFavorites = homeItems
    .filter((item) => !item.requiresAuth || isLoggedIn)
    .map((item): NavItem => {
      if (item.id === "MY_GENES" && favoriteGenes.length > 0) {
        return {
          ...item,
          children: favoriteGenes.map((gene): NavItemChild => ({
            label: gene,
            href: withVersionOverride(`/details/${gene}`),
            actions: [
              {
                icon: "close",
                tooltip: "Remove from My Genes",
                onClick: (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  unmarkFavorite(gene);
                },
              },
            ],
          })),
        };
      }

      return item;
    });

  return {
    homeItems: homeItemsWithFavorites,
    toolItems: toolItemsWithGenomeBrowser,
    resourceItems,
    activeView,
    isLoading,
  };
};
