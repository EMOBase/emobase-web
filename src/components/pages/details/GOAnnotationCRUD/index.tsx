import { Icon } from "@/components/ui/icon";
import useAsyncData from "@/hooks/useAsyncData";
import { fetchByGenes } from "@/utils/services/goAnnotationService";

import ProposeTermButton from "./ProposeTermButton";

const terms = [
  {
    id: "GO:0000001",
    name: "mitochondrion inheritance",
    pmid: "19999",
    citations: 123,
  },
  {
    id: "GO:0001921",
    name: "positive regulation of receptor recycling",
    pmid: "19999",
    citations: 123,
  },
];

type GOAnnotationCRUDProps = {
  id: string;
  title: string;
  gene: string;
};

const GOAnnotationCRUD: React.FC<GOAnnotationCRUDProps> = ({
  id,
  title,
  gene,
}) => {
  const { data, loading } = useAsyncData(() => fetchByGenes([gene]));

  return (
    <div id={id}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <h2 className="font-display text-2xl font-bold text-neutral-800 dark:text-white flex items-center gap-2">
          <Icon name="account_tree" className="text-primary" />
          {title}
        </h2>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-neutral-800 rounded-md text-xs font-medium text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
          Gene Ontology terms for{" "}
          <span className="font-bold text-primary">{gene}</span>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-8">
          <div className="space-y-8">
            {terms.map((term) => (
              <div key={term.id} className="group">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-base font-bold text-primary">
                    {term.id}
                  </span>
                  <span className="text-base font-medium text-neutral-800 dark:text-neutral-200">
                    - {term.name}
                  </span>
                  <Icon
                    name="open_in_new"
                    className="text-lg text-neutral-400 hover:text-primary cursor-pointer transition-colors"
                  />
                  <div className="flex items-center gap-2 ml-2">
                    <span className="flex items-center gap-0.5 px-2 py-0.5 rounded bg-neutral-100 text-[10px] font-bold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
                      IMP <Icon name="open_in_new" className="text-xs" />
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-50 text-[10px] font-bold text-amber-600 dark:bg-amber-900/20 dark:text-amber-500 border border-amber-100 dark:border-amber-900/30 uppercase tracking-tight">
                      UNREVIEWED
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400 pl-4">
                  <div className="flex items-center gap-2">
                    <Icon name="double_arrow" className="text-base" />
                    <span>{term.citations}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="link" className="text-sm" />
                    <span className="hover:text-primary cursor-pointer transition-colors">
                      PMID:{term.pmid}
                    </span>
                    <Icon name="open_in_new" className="text-xs" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800">
            <ProposeTermButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GOAnnotationCRUD;
