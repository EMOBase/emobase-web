import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { useAppForm } from "@/hooks/form/useAppForm";

import formOptions, { formToApiSchema } from "./formOptions";
import AddJBrowseTrackForm from "./Form";

const AddJBrowseTrackButton = ({
  onConfirm,
}: {
  onConfirm: (file: File, trackName: string) => void;
}) => {
  const [open, setOpen] = useState(false);

  const form = useAppForm({
    ...formOptions,
    onSubmit: async ({ value }) => {
      const { file, trackName } = formToApiSchema.parse(value);
      onConfirm(file, trackName);
      setOpen(false);
    },
    onSubmitInvalid() {
      const invalidInput = document.querySelector(
        '[aria-invalid="true"]',
      ) as HTMLInputElement;

      invalidInput?.focus();
    },
  });

  useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" className="font-bold text-xs px-4 py-2">
            <Icon name="add_circle" weight={500} className="text-lg" />
            ADD TRACK
          </Button>
        }
      />
      <DialogContent className="max-h-9/10 flex flex-col sm:max-w-lg overflow-hidden">
        <DialogHeader>
          <DialogTitle>Add JBrowse2 Track</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <AddJBrowseTrackForm form={form} />
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
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

export default AddJBrowseTrackButton;
