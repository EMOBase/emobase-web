import { twMerge } from "tailwind-merge";

import { Icon } from "@/components/ui/icon";

type FlybaseGeneIdProps = {
  gene: string;
  className?: string;
};

const FlybaseGeneId: React.FC<FlybaseGeneIdProps> = ({ gene, className }) => {
  return (
    <div className="flex items-center gap-2">
      <a
        href={`http://flybase.org/reports/${gene}.html`}
        target="_blank"
        className={twMerge(
          "group/link text-slate-700 hover:text-slate-900 transition-colors flex items-center gap-1 cursor-pointer",
          className,
        )}
      >
        <span className="group-hover/link:underline decoration-slate-700 underline-offset-2">
          {gene}
        </span>
        <Icon
          name="open_in_new"
          className="text-xl text-slate-400 group-hover/link:text-slate-600"
        />
      </a>
    </div>
  );
};

export default FlybaseGeneId;
