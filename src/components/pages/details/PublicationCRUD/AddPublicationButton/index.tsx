import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAppForm } from "@/hooks/form/useAppForm";

import usePublications from "../usePublications";
import formOptions from "./formOptions";
import AddPublicationForm from "./Form";

const ModalContent = ({
  gene,
  closeModal,
}: {
  gene: string;
  closeModal: () => void;
}) => {
  const addPublication = usePublications((state) => state.add);

  const form = useAppForm({
    ...formOptions,
    onSubmit: async ({ value }) => {
      const { year, ...input } = value;
      await addPublication({
        gene,
        year: year && Number(year),
        ...input,
      }).catch((err) => {
        console.log("error", err);
        toast.error("Something went wrong.");
        throw new Error("Call api create publication failed");
      });
      toast.success("Publication added");
      closeModal();
    },
  });

  return (
    <>
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <AddPublicationForm form={form} />
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

const AddPublicationButton = ({ gene }: { gene: string }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" className="px-4 py-2">
            <Icon name="add" weight={500} className="text-xl" />
            Add a Publication
          </Button>
        }
      />
      <DialogContent className="max-h-9/10 flex flex-col">
        <DialogHeader>
          <DialogTitle>Add a Publication</DialogTitle>
        </DialogHeader>
        <ModalContent gene={gene} closeModal={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default AddPublicationButton;
