type FlybaseGeneIdProps = {
  gene: string;
};

const FlybaseGeneId: React.FC<FlybaseGeneIdProps> = ({ gene }) => {
  return (
    <div className="flex items-center gap-2">
      <a
        href={`http://flybase.org/reports/${gene}.html`}
        target="_blank"
        className="group/link text-slate-700 hover:text-slate-900 transition-colors flex items-center gap-1 cursor-pointer"
      >
        <span className="group-hover/link:underline decoration-slate-700 underline-offset-2">
          {gene}
        </span>
        <span className="material-symbols-outlined text-sm text-slate-400">
          open_in_new
        </span>
      </a>
    </div>
  );
};

export default FlybaseGeneId;
