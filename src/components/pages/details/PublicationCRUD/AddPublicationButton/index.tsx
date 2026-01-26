import { useState } from "react";

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

import AddPublicationForm from "./Form";

const AddPublicationButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="px-4 py-2">
          <Icon name="add" weight={500} className="text-xl" />
          Add a Publication
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-9/10 flex flex-col">
        <DialogHeader>
          <DialogTitle>Add a Publication</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-8 bg-white">
          <AddPublicationForm id="publication-form" />
        </div>
        <DialogFooter>
          <Button variant="primary" form="publication-form">
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddPublicationButton;
