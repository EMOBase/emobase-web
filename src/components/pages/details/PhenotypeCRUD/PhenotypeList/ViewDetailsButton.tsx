import type { Phenotype } from "@/utils/constants/phenotype";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { download } from "@/components/common/DownloadButton";

const Row: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <tr>
    <td className="py-4 pl-8 pr-2 w-1/3 font-semibold text-neutral-400 uppercase text-[11px] tracking-widest align-middle">
      {label}
    </td>
    <td className="py-4 px-8 text-neutral-800 align-middle">{value}</td>
  </tr>
);

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

type ViewDetailsButtonProps = {
  phenotype: Phenotype;
};

const ViewDetailsButton: React.FC<ViewDetailsButtonProps> = ({ phenotype }) => {
  const sequence = phenotype.dsRNA.sequence;
  const penetrancePercentage = (phenotype.penetrance ?? 0) * 100;
  const referenceUrl = getReferenceUrl(phenotype.reference);
  const comment = phenotype.comment || "N/A";

  return (
    <Dialog>
      <DialogTrigger className="px-3.5 py-1.75 rounded-sm bg-neutral-100 text-neutral-600 text-[10px] font-bold hover:bg-neutral-200 transition-colors uppercase tracking-wider">
        View details
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="border-b border-neutral-100">
          <DialogTitle>{phenotype.description}</DialogTitle>
        </DialogHeader>
        <table className="w-full text-sm mb-3">
          <tbody className="divide-y divide-neutral-100">
            <Row
              label="dsRNA:"
              value={
                sequence ? (
                  <Button
                    variant="outline"
                    onClick={() => download({ content: sequence })}
                    className="gap-2 px-4 py-1.5 text-[10px] font-semibold border-1 rounded uppercase"
                  >
                    Download
                    <Icon name="download" weight={500} className="text-sm" />
                  </Button>
                ) : (
                  "N/A"
                )
              }
            />
            <Row
              label={`${phenotype.reference?.type}:`}
              value={
                referenceUrl ? (
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
                )
              }
            />
            <Row label="Injected stage:" value={phenotype.injectedStage} />
            <Row label="Penetrance:" value={`${penetrancePercentage}%`} />
            <Row label="Strain:" value={phenotype.injectedStrain} />
            <Row
              label="Concentration:"
              value={
                phenotype.concentration ? (
                  <span>
                    {phenotype.concentration}{" "}
                    <span className="italic">µg/µl</span>
                  </span>
                ) : (
                  "N/A"
                )
              }
            />
            <Row
              label="Number of animals analyzed:"
              value={phenotype.numberOfAnimals || "N/A"}
            />
            {comment.length > 80 ? (
              <tr>
                <td className="py-6 px-8 align-top" colSpan={2}>
                  <div className="font-bold text-neutral-400 uppercase text-[10px] tracking-widest mb-3">
                    Comment
                  </div>
                  {comment}
                </td>
              </tr>
            ) : (
              <Row label="Comment:" value={comment} />
            )}
          </tbody>
        </table>
      </DialogContent>
    </Dialog>
  );
};

export default ViewDetailsButton;
