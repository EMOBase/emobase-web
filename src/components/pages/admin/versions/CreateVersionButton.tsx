import * as React from "react";
import { z } from "zod";
import { toast } from "sonner";
import { formOptions } from "@tanstack/react-form";
import { navigate } from "astro:transitions/client";

import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAppForm } from "@/hooks/form/useAppForm";
import genomicsService from "@/utils/services/genomics";

const { createVersion } = genomicsService();

const versionFormOptions = formOptions({
  defaultValues: {
    versionName: "",
  },
  validators: {
    onChange: z.object({
      versionName: z.string().min(1, "Version name is required"),
    }),
  },
});

const CreateVersionButton = () => {
  const [open, setOpen] = React.useState(false);

  const form = useAppForm({
    ...versionFormOptions,
    onSubmit: async ({ value }) => {
      const data = await createVersion({ name: value.versionName }).catch(
        (err) => {
          console.log("error", err);
          toast.error("Something went wrong.");
          throw new Error("Call api create version failed");
        },
      );
      toast.success("New version initialized");
      setOpen(false);
      navigate(`admin/versions/${data.Name}`);
    },
    onSubmitInvalid() {
      const invalidInput = document.querySelector(
        '[aria-invalid="true"]',
      ) as HTMLInputElement;

      invalidInput?.focus();
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="primary">
            <Icon name="add" weight={500} className="text-xl" />
            Create New Version
          </Button>
        }
      ></DialogTrigger>
      <DialogContent
        className="max-h-9/10 flex flex-col p-2"
        closeButtonClassName="top-6 right-6"
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900 mb-2">
            Create New Version
          </DialogTitle>
          <DialogDescription className="text-slate-500 text-base leading-relaxed">
            Initialize a new version of genomic data.
            <br />
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 pt-2 pb-4 space-y-6">
          <form.AppField
            name="versionName"
            children={(field) => (
              <field.InputField
                label="Version Name"
                placeholder="e.g., v3.5.0"
              />
            )}
          />

          <div className="bg-[#f0f7ff] border-l-[4px] border-blue-600 p-5 rounded-r-xl flex items-start gap-4 shadow-sm">
            <Icon
              name="info"
              fill
              className="text-blue-600 text-2xl shrink-0 mt-0.5"
            />
            <p className="text-[#1e40af] text-sm leading-relaxed font-medium">
              This version will be isolated from the production stream until
              required files being uploaded and processed.
            </p>
          </div>
        </div>

        <DialogFooter>
          <form.AppForm>
            <form.SubmitButton
              variant="primary"
              onClick={() => form.handleSubmit()}
            >
              Continue
            </form.SubmitButton>
          </form.AppForm>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateVersionButton;
