import { useState } from "react";

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
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAppForm } from "@/hooks/form/useAppForm";

import formOptions from "./formOptions";
import AddPhenotypeForm from "./Form";

const DialogContentInner = (props: {
  gene: string;
  closeModal: () => void;
}) => {
  const form = useAppForm({
    ...formOptions,
    onSubmit: async ({ value }) => {
      console.log("handle submit", { value });
    },
  });

  return (
    <>
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <AddPhenotypeForm form={form} />
      </div>
      <DialogFooter>
        <Button>Submit</Button>
      </DialogFooter>
    </>
  );
};

const AddPhenotypeButton = ({ gene }: { gene: string }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <DialogTrigger asChild>
          <TooltipTrigger asChild>
            <Button variant="outline" className="px-4 py-2">
              <Icon name="add" weight={500} className="text-xl" />
              Add
            </Button>
          </TooltipTrigger>
        </DialogTrigger>
        <TooltipContent>Add a RNAi Phenotype</TooltipContent>
      </Tooltip>
      <DialogContent className="max-h-9/10 flex flex-col">
        <DialogHeader>
          <DialogTitle>Add a RNAi Phenotype</DialogTitle>
        </DialogHeader>
        <DialogContentInner gene={gene} closeModal={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default AddPhenotypeButton;
