import GeneFavoriteMark from "./GeneFavoriteMark";

type IBBGeneIdProps = {
  gene: string;
};

const IBBGeneId: React.FC<IBBGeneIdProps> = ({ gene }) => {
  return (
    <div className="flex items-center gap-2">
      <a
        href={`/details/${gene}`}
        className="text-primary hover:text-primary-bold font-bold hover:underline decoration-primary decoration-2 underline-offset-2 cursor-pointer"
      >
        {gene}
      </a>
      <GeneFavoriteMark gene={gene} />
    </div>
  );
};

export default IBBGeneId;
