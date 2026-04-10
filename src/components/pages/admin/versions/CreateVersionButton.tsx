import * as React from "react";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";

const CreateVersionButton = () => {
  const [open, setOpen] = React.useState(false);

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
          <DialogTitle className="text-xl">Create New Version</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <Field>
            <div className="flex items-center justify-between mb-2">
              <FieldLabel className="text-slate-900 font-bold text-sm m-0">
                Version Name
              </FieldLabel>
            </div>
            <Input
              placeholder="e.g., v3.5.0"
              className="text-slate-900 placeholder:text-slate-400 py-4"
            />
          </Field>

          <div className="bg-[#f0f7ff] border-l-[4px] border-blue-600 p-5 rounded-r-xl flex items-start gap-4 shadow-sm mt-6">
            <Icon
              name="info"
              fill
              className="text-blue-600 text-2xl shrink-0 mt-0.5"
            />
            <p className="text-[#1e40af] text-sm leading-relaxed font-medium">
              This version will be isolated from the production stream until all
              required files are uploaded and processed.
            </p>
          </div>
        </div>

        <DialogFooter className="border-t border-slate-50 flex items-center justify-end gap-4">
          <Button variant="primary">Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateVersionButton;
