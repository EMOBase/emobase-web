import { twMerge } from "tailwind-merge";

import { Icon } from "@/components/ui/icon";
import type { Phenotype } from "@/utils/constants/phenotype";

import ImageHolder from "./ImageHolder";
import ViewDetailsButton from "./ViewDetailsButton";

type PhenotypeItemProps = {
  phenotype: Phenotype;
  className?: string;
};

const getReferenceUrl = (reference: Phenotype["reference"]) => {
  const { type, value } = reference ?? {};

  if (!value) {
    return "";
  } else if (type === "DOI") {
    return `https://doi.org/${value}`;
  } else if (type === "PMID") {
    return `https://www.ncbi.nlm.nih.gov/pubmed/${value}`;
  } else {
    return "";
  }
};

const PhenotypeItem: React.FC<PhenotypeItemProps> = ({
  phenotype,
  className,
}) => {
  const penetrancePercentage = (phenotype.penetrance ?? 0) * 100;
  const images = phenotype.images ?? [];
  const referenceUrl = getReferenceUrl(phenotype.reference);

  return (
    <div
      className={twMerge("transition-colors hover:bg-neutral-50/50", className)}
    >
      <div className="flex items-center justify-between">
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
        <ViewDetailsButton phenotype={phenotype} />
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
          {referenceUrl ? (
            <a
              href={referenceUrl}
              target="_blank"
              className="group/link text-primary inline-flex items-center gap-0.5"
            >
              <span className="group-hover/link:underline underline-offset-2">
                {phenotype.reference?.value}
              </span>{" "}
              <Icon name="open_in_new" className="text-base" />
            </a>
          ) : (
            <span className="text-neutral-700">
              {phenotype.reference?.value}
            </span>
          )}
        </div>
      </div>

      {images.length > 0 && (
        <div className="flex gap-4 overflow-x-auto scrollbar-hide mt-5 mb-1">
          {images.map((image) => (
            <ImageHolder
              key={image.id}
              imageId={image.id}
              status={image.status}
              className="w-48"
            />
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
      <div className="flex flex-col gap-6 divide-y divide-neutral-100 p-7">
        {phenotypes.map((phenotype, index) => (
          <PhenotypeItem
            key={phenotype.id}
            phenotype={phenotype}
            className={index === phenotypes.length - 1 ? undefined : "pb-6"}
          />
        ))}
      </div>
    </div>
  );
};

export default PhenotypeList;
