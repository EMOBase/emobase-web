import React from "react";
import { useSession } from "@/hooks/session/useSession";
import { useFavoriteGenes } from "@/states/favoriteGenes";
import { mainSpecies } from "@/utils/mainSpecies";
import { homeItems, toolItems, resourceItems, getActiveView } from "./constants";
import type { NavItem, NavItemChild } from "./types";

export const useSidebarSections = (url: string, title?: React.ReactNode) => {
  const { isLoggedIn } = useSession();
  const { isLoading, getFavoriteGenes, unmarkFavorite } = useFavoriteGenes();
  const favoriteGenes = getFavoriteGenes();
  const activeView = getActiveView(url);

  const homeItemsWithFavorites = homeItems
    .filter((item) => !item.requiresAuth || isLoggedIn)
    .map((item): NavItem => {
      if (item.id === "MY_GENES" && favoriteGenes.length > 0) {
        return {
          ...item,
          children: favoriteGenes.map(
            (gene): NavItemChild => ({
              label: gene,
              href: `/details/${gene}`,
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
            }),
          ),
        };
      }
      return item;
    });

  const toolItemsForNonBeetle = toolItems.map((item) => {
    if (item.id === "BLAST") {
      return {
        ...item,
        children: (item.children ?? []).map((child) => ({
          ...child,
          label: child.href === "/blast/" ? <>{title} Blast</> : child.label,
        })),
      };
    }
    return item;
  });

  const finalToolItems =
    mainSpecies === "Tcas" ? toolItems : toolItemsForNonBeetle;

  return {
    homeItems: homeItemsWithFavorites,
    toolItems: finalToolItems,
    resourceItems,
    activeView,
    isLoading,
  };
};
