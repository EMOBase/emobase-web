import { twMerge } from "tailwind-merge";

import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { GOAnnotation } from "@/utils/constants/goannotation";

const Row: React.FC<{
  label: string;
  value: React.ReactNode;
  labelClassName?: string;
  valueClassName?: string;
}> = ({ label, value, labelClassName, valueClassName }) => (
  <tr>
    <td
      className={twMerge(
        "py-4 pl-8 pr-2 w-1/3 font-semibold text-neutral-400 uppercase text-[11px] tracking-widest align-middle",
        labelClassName,
      )}
    >
      {label}
    </td>
    <td
      className={twMerge(
        "py-4 px-8 text-neutral-800 align-middle whitespace-pre-line",
        valueClassName,
      )}
    >
      {value}
    </td>
  </tr>
);

const getLinkGeneOntologyTerm = (annotation: GOAnnotation) => {
  if (annotation.term.id) {
    return `http://amigo.geneontology.org/amigo/term/${annotation.term.id}`;
  }
};

const getLinkEvidence = (annotation: GOAnnotation) => {
  if (annotation.evidence) {
    return "http://geneontology.org/docs/guide-go-evidence-codes/";
  }
};

const getPmid = (annotation: GOAnnotation) => {
  return annotation.reference
    .split("|")
    .filter((r) => r.startsWith("PMID:"))[0]
    ?.split(":")[1];
};

const getLinkReference = (annotation: GOAnnotation) => {
  const pmid = getPmid(annotation);

  if (pmid) {
    return `https://pubmed.ncbi.nlm.nih.gov/${pmid}`;
  }
};

type ViewDetailsButtonProps = {
  annotation: GOAnnotation;
} & React.ComponentProps<typeof Button>;

const ViewDetailsButton: React.FC<ViewDetailsButtonProps> = ({
  annotation,
  ...props
}) => {
  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger render={<Button {...props} />} />
        </TooltipTrigger>
        <TooltipContent>View details</TooltipContent>
      </Tooltip>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="border-b border-neutral-100">
          <DialogTitle>{annotation.term.id}</DialogTitle>
        </DialogHeader>
        <table className="w-full text-sm mb-3">
          <tbody className="divide-y divide-neutral-100">
            <Row
              label="Term:"
              labelClassName="align-top"
              value={
                <div>
                  <a
                    href={getLinkGeneOntologyTerm(annotation)}
                    target="_blank"
                    className="group/link flex items-center gap-1.5 hover:text-primary transition-colors"
                  >
                    <span className="font-semibold text-sm text-slate-900">
                      {annotation.term.id}
                    </span>
                    <Icon
                      name="open_in_new"
                      className="text-base text-neutral-400"
                    />
                  </a>
                  <p className="text-xs leading-relaxed text-slate-500 mt-1">
                    {annotation.term.name}
                  </p>
                </div>
              }
            />
            <Row label="Gene product:" value={annotation.geneProduct} />
            <Row
              label="Evidence code:"
              value={
                <a
                  href={getLinkEvidence(annotation)}
                  target="_blank"
                  className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-neutral-100 text-[10px] font-bold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700"
                >
                  {annotation.evidence}{" "}
                  <Icon name="open_in_new" className="text-xs" />
                </a>
              }
            />
            <Row
              label="PubMed ID:"
              value={
                <a
                  href={getLinkReference(annotation)}
                  target="_blank"
                  className="group/link flex text-neutral-500 items-center gap-1"
                >
                  <span className="group-hover/link:text-primary cursor-pointer transition-colors">
                    {getPmid(annotation)}
                  </span>
                  <Icon name="open_in_new" className="text-lg" />
                </a>
              }
            />
            <Row
              label="Quotation:"
              value={annotation.quotation}
              labelClassName="align-top"
            />
            <Row label="Lab:" value={annotation.lab} />
          </tbody>
        </table>
      </DialogContent>
    </Dialog>
  );
};

export default ViewDetailsButton;
