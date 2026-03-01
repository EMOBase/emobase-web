type InfoCardProps = {
  intro?: string;
  sections: {
    title: string;
    content: React.ReactNode;
  }[];
};

const InfoCard: React.FC<InfoCardProps> = ({ intro, sections }) => {
  return (
    <div className="bg-white rounded-xl border border-border-subtle shadow-sm overflow-hidden">
      <div className="p-8 lg:p-12 space-y-12">
        {intro && <p className="text-slate-600 leading-relaxed">{intro}</p>}
        {sections.map(({ title, content }, index) => (
          <section key={index}>
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold">
                {String(index + 1).padStart(2)}
              </span>
              <h2 className="text-2xl font-display font-bold tracking-tight">
                {title}
              </h2>
            </div>
            <div className="pl-11 border-l border-slate-100">
              <div className="text-slate-600 leading-relaxed space-y-4">
                {content}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default InfoCard;
