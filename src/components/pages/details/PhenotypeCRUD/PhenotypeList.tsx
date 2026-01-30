import { twMerge } from "tailwind-merge";

import { Icon } from "@/components/ui/icon";
import type { Phenotype } from "@/utils/constants/phenotype";

type PhenotypeItemProps = {
  phenotype: Phenotype;
  className?: string;
};

const PhenotypeItem: React.FC<PhenotypeItemProps> = ({
  phenotype,
  className,
}) => {
  const penetrancePercentage = (phenotype.penetrance ?? 0) * 100;
  const images = phenotype.images ?? [];

  return (
    <div
      className={twMerge("transition-colors hover:bg-neutral-50/50", className)}
    >
      <div className="flex items-center gap-2.5 mb-2">
        <h3 className="text-base font-semibold text-neutral-900">
          {phenotype.description}
        </h3>
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${
            penetrancePercentage > 70
              ? "bg-green-50 text-green-600 border-green-100"
              : "bg-orange-50 text-orange-500 border-orange-100"
          }`}
        >
          {penetrancePercentage}%
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-neutral-500">
        <div>
          <span className="font-medium text-neutral-400 mr-1">
            Injected stage:
          </span>{" "}
          <span className="text-neutral-700">{phenotype.injectedStage}</span>
        </div>
        <div>
          <span className="font-medium text-neutral-400 mr-1">Strain:</span>{" "}
          <span className="text-neutral-700">{phenotype.injectedStrain}</span>
        </div>
        <div>
          <span className="font-medium text-neutral-400 mr-1">
            {phenotype.reference?.type}:
          </span>
          <a
            href="#"
            className="group/link text-primary inline-flex items-center gap-0.5"
          >
            <span className="group-hover/link:underline underline-offset-2">
              {phenotype.reference?.value}
            </span>{" "}
            <Icon name="open_in_new" className="text-base" />
          </a>
        </div>
      </div>

      {images.length > 0 && (
        <div className="flex gap-4 overflow-x-auto scrollbar-hide mt-5 mb-1">
          {images.map((img) => (
            <div
              key={img.id}
              className="w-48 aspect-[4/3] bg-neutral-50 rounded-lg flex flex-col items-center justify-center border border-neutral-100 group cursor-pointer hover:border-primary/30 transition-all shrink-0"
            >
              <span className="material-symbols-outlined text-neutral-300 group-hover:text-primary/50 text-3xl mb-1 transition-colors">
                image
              </span>
              <span className="text-[10px] text-neutral-400 uppercase font-medium tracking-tight">
                Phenotype Image {img.id}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

type PhenotypeListProps = {
  phenotypes: Phenotype[];
};

const PhenotypeList: React.FC<PhenotypeListProps> = ({ phenotypes }) => {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
      <div className="flex flex-col gap-5 divide-y divide-neutral-100 p-6">
        {phenotypes.map((phenotype, index) => (
          <PhenotypeItem
            key={phenotype.id}
            phenotype={phenotype}
            className={index === phenotypes.length - 1 ? undefined : "pb-5"}
          />
        ))}
      </div>
    </div>
  );
};

export default PhenotypeList;
