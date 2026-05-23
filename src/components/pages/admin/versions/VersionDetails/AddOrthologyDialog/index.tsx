import { useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { useAppForm } from "@/hooks/form/useAppForm";

import formOptions, { formToApiSchema } from "./formOptions";
import AddOrthologyForm from "./Form";

type AddOrthologyDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (file: File, order: number, algorithm: string) => void;
};

const AddOrthologyDialog: React.FC<AddOrthologyDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const form = useAppForm({
    ...formOptions,
    onSubmit: async ({ value }) => {
      const { file, order, algorithm } = formToApiSchema.parse(value);
      onConfirm(file, order, algorithm);
    },
    onSubmitInvalid() {
      const invalidInput = document.querySelector(
        '[aria-invalid="true"]',
      ) as HTMLInputElement;

      invalidInput?.focus();
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-9/10 flex flex-col sm:max-w-lg overflow-hidden">
        <DialogHeader>
          <DialogTitle>Add Orthology Dataset</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <AddOrthologyForm form={form} />
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="px-5 py-2.5 text-xs"
          >
            Cancel
          </Button>
          <form.AppForm>
            <form.SubmitButton
              variant="primary"
              type="button"
              onClick={() => form.handleSubmit()}
              className="font-bold text-xs px-4 py-2.5 gap-2"
            >
              <Icon name="cloud_upload" className="text-base" />
              Confirm & Upload
            </form.SubmitButton>
          </form.AppForm>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddOrthologyDialog;
