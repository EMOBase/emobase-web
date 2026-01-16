import { cn } from "@/utils/classname";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Icon } from "@/components/ui/icon";
import { useFavoriteGenes } from "@/states/favoriteGenes";

type FavoriteMarkProps = {
  gene: string;
  className?: string;
};

const GeneFavoriteMark: React.FC<FavoriteMarkProps> = ({ gene, className }) => {
  const { checkIsFavorite, toggleFavorite } = useFavoriteGenes();
  const isFavorite = checkIsFavorite(gene);

  return (
    <Tooltip>
      <TooltipTrigger
        className={cn("flex cursor-pointer text-[1.44em]", className)}
        onClick={() => toggleFavorite(gene)}
      >
        <Icon name="star" fill={isFavorite} className="text-amber-400" />
      </TooltipTrigger>
      <TooltipContent>
        {isFavorite ? "Remove from My Genes" : "Add to My Genes"}
      </TooltipContent>
    </Tooltip>
  );
};

export default GeneFavoriteMark;
