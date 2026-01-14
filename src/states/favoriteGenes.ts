import { useLocalStorage } from "usehooks-ts";

const LOCAL_STORAGE_KEY = "favorite-genes";

type FavoriteGeneRecord = Record<string, boolean>;

export const useFavoriteGenes = () => {
  const [favoriteGeneRecord, setFavoriteGeneRecord] =
    useLocalStorage<FavoriteGeneRecord>(LOCAL_STORAGE_KEY, {});

  const getFevoriteGenes = () => {
    return Object.keys(favoriteGeneRecord).map(
      (gene) => favoriteGeneRecord[gene],
    );
  };

  const checkIsFavorite = (gene: string) => {
    return !!favoriteGeneRecord[gene];
  };

  const markFavorite = (gene: string) => {
    setFavoriteGeneRecord((current) => ({
      ...current,
      [gene]: true,
    }));
  };

  const unmarkFavorite = (gene: string) => {
    setFavoriteGeneRecord((current) => ({
      ...current,
      [gene]: false,
    }));
  };

  const toggleFavorite = (gene: string) => {
    setFavoriteGeneRecord((current) => ({
      ...current,
      [gene]: !current[gene],
    }));
  };

  return {
    getFevoriteGenes,
    checkIsFavorite,
    markFavorite,
    unmarkFavorite,
    toggleFavorite,
  };
};
