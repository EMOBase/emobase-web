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
      <DialogContent className="max-w-xl max-h-9/10 flex flex-col">
        <DialogHeader>
          <DialogTitle>Add a Publication</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6 pt-2 pb-4 space-y-6 scrollbar-thin">
          <div className="h-[500px]">Add publication form</div>
        </div>
        <DialogFooter>
          <Button variant="primary">Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddPublicationButton;
