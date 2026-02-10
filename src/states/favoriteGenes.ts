import { useLocalStorage } from "usehooks-ts";

const LOCAL_STORAGE_KEY = "favorite-genes";

type FavoriteGeneRecord = Record<string, boolean>;

export const useFavoriteGenes = () => {
  const [favoriteGeneRecord, setFavoriteGeneRecord] =
    useLocalStorage<FavoriteGeneRecord>(
      LOCAL_STORAGE_KEY,
      {},
      {
        initializeWithValue: false,
      },
    );

  const getFavoriteGenes = () => {
    return Object.keys(favoriteGeneRecord).filter(
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
    getFavoriteGenes,
    checkIsFavorite,
    markFavorite,
    unmarkFavorite,
    toggleFavorite,
  };
};
