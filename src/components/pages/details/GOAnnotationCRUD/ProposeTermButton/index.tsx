import { useRef } from "react";

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

const ProposeTermButton = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  return (
    <Dialog>
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

          <ProposeTermForm ref={formRef} firstInputRef={firstInputRef} />
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
