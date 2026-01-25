import { useRef, useState } from "react";

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

import ProposeTermForm from "./Form";

const ProposeTermButton = ({ gene }: { gene: string }) => {
  const [open, setOpen] = useState(false);
  const closeForm = () => setOpen(false);
  const formRef = useRef<HTMLFormElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="px-4 py-2">
          <Icon name="add" weight={500} className="text-xl" />
          Propose a GO Term
        </Button>
      </DialogTrigger>
      <DialogContent
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          firstInputRef.current?.focus();
        }}
        className="max-w-xl max-h-9/10 flex flex-col"
      >
        <DialogHeader>
          <DialogTitle>Propose a GO Term</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6 pt-2 pb-4 space-y-6 scrollbar-thin">
          <p className="text-[13px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Assign a GO term to this <i className="font-medium">Tribolium</i>{" "}
            gene by filling in the fields. Repeat to add several GO terms.
            Search
            <a
              className="group/link inline-flex items-center gap-1 text-primary font-medium mx-1"
              href="https://amigo.geneontology.org/amigo/dd_browse"
              target="_blank"
            >
              <span className="group-hover/link:underline">AmiGO</span>
              <Icon name="open_in_new" className="text-sm" />
            </a>
            for the correct GO ID. Use only the most specific term ("child
            terms" are more specific; the more general "parent" terms will be
            automatically linked). Only information based on{" "}
            <i className="font-medium">Tribolium</i> data should be entered - do
            not define terms just based on{" "}
            <i className="font-medium">Drosophila</i> knowledge. We will review
            this information and submit the annotation to the Gene Ontology
            consortium.
          </p>

          <ProposeTermForm
            id="go-form"
            ref={formRef}
            firstInputRef={firstInputRef}
            gene={gene}
            closeForm={closeForm}
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            form="go-form"
            value="submit"
            onClick={(e) => formRef.current?.requestSubmit(e.currentTarget)}
          >
            Submit & Propose another
          </Button>
          <Button
            variant="primary"
            form="go-form"
            value="submit&close"
            onClick={(e) => formRef.current?.requestSubmit(e.currentTarget)}
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProposeTermButton;
