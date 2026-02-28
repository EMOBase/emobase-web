import { Icon } from "@/components/ui/icon";

type ProcedureItem = {
  day: string;
  title?: string;
  description?: string;
};

const pupalIP: ProcedureItem[] = [
  {
    day: "Day 0",
    description:
      "10 female pupae of the pBA19 strain (muscle enhancer trap line) were injected with dsRNA.",
  },
  {
    day: "3 dpi",
    description:
      "Hatch control: Pupal and adult lethality as well as metamorphosis defects (molting, eclosion) were documented. For mating, 4 males of the black strain were added.",
  },
  {
    day: "9 dpi",
    description:
      "First egg-lay was collected and incubated for cuticle analysis. Adult lethality and egg production (reduced/ no egg-lay) was documented.",
  },
  {
    day: "11 dpi",
    description:
      "Second egg-lay was collected and incubated for embryonic muscle analysis. Adult lethality and egg production (reduced/ no egg-lay) were documented.",
  },
  {
    day: "13 dpi",
    title: "Egg productivity and Ovary analysis",
    description:
      "The percentage of hatched larvae was documented and not hatched larvae/ eggs were embedded for cuticle analysis (15 dpi). In case of a reduction of egg production, 4 injected females were dissected to analyze the gross morphology of the ovaries.",
  },
  {
    day: "14 dpi",
    title: "Analysis of embryonic musculature and early embryonic development",
    description:
      "Offspring of the injected females (hatched and not hatched larvae/ eggs) were analysed for embryonic lethality and muscle defects.",
  },
  {
    day: "15 dpi",
    title: "Analysis of larval instar 1 cuticle",
    description:
      "Offspring of injected females were analysed and cuticle phenotypes were annotated.",
  },
  {
    day: "22 dpi",
    title: "Stink gland analysis",
    description:
      "Documentation of defects in abdominal and thoracic stink glands (colour, size, content) of the injected femals.",
  },
];

const lavalIP: ProcedureItem[] = [
  {
    day: "Day 0",
    description:
      "10 Instar larvae (L6; Female larvae were derived from a cross between D17Xred and pearl strainsD17Xred and pearl) were injected with dsRNA 1 μg μl-1",
  },
  {
    day: "11 dpi",
    description:
      "Analysis of pupal Morphology, Larval lethality and muscle defects",
  },
  {
    day: "20 dpi",
    title: "Hatch-Check",
  },
  {
    day: "23 dpi",
    title: "Adult Morphology and fertility",
    description:
      "The percentage of hatched larvae was documented. In case of a reduction of egg production, 4 injected females were dissected to analyze the gross morphology of the ovaries.",
  },
  {
    day: "6 wpi",
    title: "Stink Gland Analysis",
    description:
      "Documentation of defects in abdominal and thoracic stink glands (colour, size, content) of the injected females.",
  },
];

const Procedure = () => {
  return (
    <section className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-8">
        <Icon name="biotech" className="text-primary text-3xl" />
        <h2 className="text-3xl font-bold font-display text-[#0f172a] tracking-tight">
          Screening Procedure
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative">
        <div>
          <TimelineHeader title="Pupal Injection Procedure" />
          <div className="space-y-6">
            {pupalIP.map((item, index) => (
              <TimelineItem key={`pupal-${index}`} item={item} />
            ))}
          </div>
        </div>

        <div>
          <TimelineHeader title="Larval Injection Procedure" />
          <div className="space-y-6">
            {lavalIP.map((item, index) => (
              <TimelineItem key={`larval-${index}`} item={item} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-slate-100">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">
          * DPI = DAYS POST INJECTION
        </p>
        <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mt-2">
          * WPI = WEEKS POST INJECTION
        </p>
      </div>
    </section>
  );
};

const TimelineHeader = ({ title }: { title: string }) => (
  <div className="flex items-center gap-2 mb-10">
    <span className="w-1.5 h-6 bg-primary rounded-full"></span>
    <h3 className="text-xl font-bold text-slate-900">{title}</h3>
  </div>
);

const TimelineItem = ({ item }: { item: ProcedureItem }) => {
  return (
    <div className="grid grid-cols-[4rem_1fr] gap-6 items-start">
      <div className="pt-6">
        <span className="text-sm font-bold text-primary uppercase tracking-wider block">
          {item.day.replace(" dpi", " dpi*").replace(" wpi", " wpi*")}
        </span>
      </div>
      <div className="bg-slate-50 p-6 rounded-lg space-y-2">
        {item.title && (
          <h4 className="text-base font-bold text-slate-900 leading-snug">
            {item.title}
          </h4>
        )}
        {item.description && (
          <p className="text-slate-600 leading-relaxed text-sm">
            {item.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default Procedure;
