import { useRef, useActionState } from "react";

import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ProposeTermForm = ({ ref }: { ref: React.Ref<HTMLFormElement> }) => {
  return (
    <form ref={ref} className="space-y-6">
      <div className="group">
        <label className="text-sm font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1 mb-1.5">
          *GO ID:{" "}
          <Icon name="help" className="text-lg text-neutral-400 cursor-help" />
        </label>
        <input
          className="w-full rounded-sm border border-neutral-300 bg-white px-3 py-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary dark:bg-neutral-800 dark:border-neutral-700 placeholder:text-neutral-300 dark:text-white"
          placeholder="GO: 0000000"
          type="text"
          name="goId"
        />
      </div>

      <div>
        <label className="text-sm font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1 mb-1.5">
          *Gene product
        </label>
        <div className="relative">
          <select
            name="geneProduct"
            className="w-full rounded-sm border border-neutral-300 bg-white px-3 py-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary dark:bg-neutral-800 dark:border-neutral-700 appearance-none dark:text-white"
          >
            <option>protein</option>
            <option>mRNA</option>
            <option>ncRNA</option>
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-neutral-400">
              arrow_drop_down
            </span>
          </div>
        </div>
      </div>

      <div>
        <label className="text-sm font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1 mb-1.5">
          *Evidence code:
          <Icon name="help" className="text-lg text-neutral-400 cursor-help" />
          <Icon name="open_in_new" className="text-lg text-neutral-400" />
        </label>
        <input
          className="w-full rounded-sm border border-neutral-300 bg-white px-3 py-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary dark:bg-neutral-800 dark:border-neutral-700 placeholder:text-neutral-300 dark:text-white"
          placeholder="e.g. IMP"
          type="text"
          name="evidence"
        />
      </div>

      <div>
        <label className="text-sm font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1 mb-1.5">
          *PubMed ID:{" "}
          <Icon name="help" className="text-lg text-neutral-400 cursor-help" />
        </label>
        <input
          className="w-full rounded-sm border border-neutral-300 bg-white px-3 py-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary dark:bg-neutral-800 dark:border-neutral-700 placeholder:text-neutral-300 dark:text-white"
          placeholder="PMID: e.g. 18586236"
          type="text"
          name="pmid"
        />
      </div>

      <div>
        <label className="text-sm font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1 mb-1.5">
          Quotation:{" "}
          <Icon name="help" className="text-lg text-neutral-400 cursor-help" />
        </label>
        <textarea
          className="w-full rounded-sm border border-neutral-300 bg-white px-3 py-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary dark:bg-neutral-800 dark:border-neutral-700 placeholder:text-neutral-300 min-h-[140px] resize-none dark:text-white"
          placeholder="Relevant section from the publication"
          name="quotation"
        ></textarea>
      </div>

      <div>
        <label className="text-sm font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1 mb-1.5">
          *Lab name:
        </label>
        <input
          className="w-full rounded-sm border border-neutral-300 bg-white px-3 py-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
          type="text"
          name="lab"
        />
      </div>
    </form>
  );
};

const ProposeTermButton = () => {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="px-4 py-2">
          <Icon name="add" weight={500} className="text-xl" />
          Propose a GO Term
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl max-h-9/10 flex flex-col">
        <DialogHeader>
          <DialogTitle>Propose a GO Term</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6 pt-2 pb-4 space-y-6 scrollbar-thin">
          <p className="text-[13px] text-neutral-600 dark:text-neutral-400 leading-relaxed italic">
            Assign a GO term to this <i>Tribolium</i> gene by filling in the
            fields. Repeat to add several GO terms. Search
            <a
              className="group/link inline-flex items-center gap-1 text-primary font-medium mx-1"
              href="#"
              target="_blank"
            >
              <span className="group-hover/link:underline">AmiGO</span>
              <Icon name="open_in_new" className="text-sm" />
            </a>
            for the correct GO ID. Use only the most specific term ("child
            terms") or more specific; the more general "parent" terms will be
            automatically linked.
          </p>

          <ProposeTermForm ref={formRef} />
        </div>
        <DialogFooter>
          <Button variant="outline">Submit & Propose another</Button>
          <Button
            variant="primary"
            onClick={() => formRef.current?.requestSubmit()}
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProposeTermButton;
