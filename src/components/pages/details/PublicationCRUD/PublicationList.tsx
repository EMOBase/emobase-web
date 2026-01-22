import { Icon } from "@/components/ui/icon";

const pubs = [
  {
    id: "1",
    title:
      "Delimiting the conserved features of hunchback function for the trunk organization of insects.",
    authors: "Marques-Souza et al.",
    journal: "Development (Cambridge, England)",
    year: 2008,
  },
  {
    id: "2",
    title:
      "Regulation of the Tribolium homologues of caudal and hunchback in Drosophila: evidence for maternal gradient systems in a short germ embryo.",
    authors: "Wolff et al.",
    journal: "Development (Cambridge, England)",
    year: 1998,
  },
  {
    id: "3",
    title:
      "The genes orthodenticle and hunchback substitute for bicoid in the beetle Tribolium.",
    authors: "Reinhard Schröder et al.",
    journal: "Nature",
    year: 2003,
  },
];

const PublicationList = () => {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-8">
      <div className="space-y-8">
        {pubs.map((pub, idx) => (
          <div
            key={pub.id}
            className={`space-y-1.5 ${idx !== 0 ? "pt-6 border-t border-neutral-100" : ""}`}
          >
            <h3 className="group/link text-base font-semibold hover:text-primary cursor-pointer inline-flex justify-between gap-2 transition-colors leading-tight w-full">
              {pub.title}
              <Icon
                name="open_in_new"
                className="text-xl text-neutral-400 group-hover/link:text-primary transition-colors"
              />
            </h3>
            <div className="flex items-center flex-wrap text-[13px] text-neutral-500">
              <div className="flex items-center">
                <span className="mr-1">Authors:</span>
                <span className="text-neutral-700 font-medium">
                  {pub.authors}
                </span>
              </div>
              <span className="mx-3 h-3 w-px bg-neutral-300"></span>
              <div className="flex items-center">
                <span className="mr-1">Journal:</span>
                <span className="text-neutral-700 italic">{pub.journal}</span>
              </div>
              <span className="mx-3 h-3 w-px bg-neutral-300"></span>
              <div className="flex items-center">
                <span className="mr-1">Year:</span>
                <span className="text-neutral-700">{pub.year}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button className="px-3 py-1 rounded bg-neutral-100 text-neutral-600 text-[10px] font-bold hover:bg-neutral-200 transition-colors uppercase tracking-wider">
                MORE
              </button>
              <button
                onClick={() => {}}
                className="px-3 py-1 rounded bg-neutral-100 text-neutral-600 text-[10px] font-bold hover:bg-neutral-200 transition-colors uppercase tracking-wider"
              >
                CITE
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicationList;
