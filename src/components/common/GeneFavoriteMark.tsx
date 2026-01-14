import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useFavoriteGenes } from "@/states/favoriteGenes";

type FavoriteMarkProps = {
  gene: string;
};

const GeneFavoriteMark: React.FC<FavoriteMarkProps> = ({ gene }) => {
  const { checkIsFavorite, toggleFavorite } = useFavoriteGenes();
  const isFavorite = checkIsFavorite(gene);

  return (
    <Tooltip>
      <TooltipTrigger
        className="flex cursor-pointer text-[1.44em]"
        onClick={() => toggleFavorite(gene)}
      >
        <span
          className="material-symbols-outlined text-amber-400"
          style={{
            fontSize: "unset",
            fontVariationSettings: isFavorite ? "'FILL' 1" : "'FILL' 0",
          }}
        >
          star
        </span>
      </TooltipTrigger>
      <TooltipContent>
        {isFavorite ? "Remove from My Genes" : "Add to My Genes"}
      </TooltipContent>
    </Tooltip>
  );
};

export default GeneFavoriteMark;
