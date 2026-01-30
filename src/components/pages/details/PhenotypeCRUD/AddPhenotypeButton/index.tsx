import { useState } from "react";
import { toast } from "sonner";

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
import type { IBDsRNA } from "@/utils/constants/ibeetle";

import usePhenotypes from "../usePhenotypes";
import formOptions, { formToApiSchema } from "./formOptions";
import AddPhenotypeForm from "./Form";

const DialogContentInner = ({
  gene,
  dsRNAs,
  closeModal,
}: {
  gene: string;
  dsRNAs: IBDsRNA[];
  closeModal: () => void;
}) => {
  const addPhenotype = usePhenotypes((state) => state.add);

  const form = useAppForm({
    ...formOptions,
    onSubmit: async ({ value }) => {
      const input = formToApiSchema.parse(value);

      await addPhenotype({
        gene,
        ...input,
      }).catch((err) => {
        console.log("error", err);
        toast.error("Something went wrong.");
        throw new Error("Call api create phenotype failed");
      });
      toast.success("Phenotype added");
      closeModal();
    },
    onSubmitInvalid() {
      const invalidInput = document.querySelector(
        '[aria-invalid="true"]',
      ) as HTMLInputElement;

      invalidInput?.focus();
    },
  });

  return (
    <>
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <AddPhenotypeForm form={form} gene={gene} dsRNAs={dsRNAs} />
      </div>

      <DialogFooter>
        <form.AppForm>
          <form.SubmitButton
            variant="primary"
            type="button"
            onClick={() => form.handleSubmit()}
          />
        </form.AppForm>
      </DialogFooter>
    </>
  );
};

const AddPhenotypeButton = ({
  gene,
  dsRNAs,
}: {
  gene: string;
  dsRNAs: IBDsRNA[];
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger
            render={
              <Button variant="outline" className="px-4 py-2">
                <Icon name="add" weight={500} className="text-xl" />
                Add
              </Button>
            }
          />
        </TooltipTrigger>
        <TooltipContent>Add a RNAi Phenotype</TooltipContent>
      </Tooltip>
      <DialogContent className="max-h-9/10 flex flex-col">
        <DialogHeader>
          <DialogTitle>Add a RNAi Phenotype</DialogTitle>
        </DialogHeader>
        <DialogContentInner
          gene={gene}
          closeModal={() => setOpen(false)}
          dsRNAs={dsRNAs}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddPhenotypeButton;
