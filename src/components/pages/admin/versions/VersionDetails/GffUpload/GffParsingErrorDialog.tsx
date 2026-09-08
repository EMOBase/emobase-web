import React from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";

type GffParsingErrorDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  error: string;
  onUploadDifferentFile: () => void;
};

export const GffParsingErrorDialog: React.FC<GffParsingErrorDialogProps> = ({
  isOpen,
  onClose,
  error,
  onUploadDifferentFile,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="p-0 sm:max-w-lg overflow-hidden"
        showCloseButton={false}
      >
        <div className="flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 bg-slate-100/80 border-b border-slate-200/60">
            <h2 className="text-sm font-bold text-primary font-display tracking-tight">
              GFF File Parsing Error
            </h2>
            <DialogClose className="flex cursor-pointer text-slate-400 hover:text-slate-600 rounded-sm opacity-70 hover:opacity-100 transition-opacity focus:outline-none">
              <Icon name="close" className="text-2xl" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </div>

          <div className="px-8 py-8 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-5">
              <Icon
                name="error"
                className="text-2xl text-red-600"
                weight={600}
              />
            </div>

            <h3 className="text-2xl font-bold text-slate-900 font-display tracking-tight mb-3">
              Unable to Parse GFF File
            </h3>

            <p className="text-sm text-slate-500 leading-relaxed max-w-lg mb-8">
              The clinical curator was unable to extract valid attributes from
              your document. The genomic structure provided does not align with
              the required specification for parsing.
            </p>

            <div className="w-full bg-blue-50/40 border-l-4 border-red-600 rounded-r-2xl p-5 flex gap-3 text-left">
              <div className="w-6 h-6 rounded bg-red-100 flex items-center justify-center text-red-600 shrink-0 mt-0.5">
                <Icon name="terminal" className="text-sm font-semibold" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  System Execution Log
                </span>
                <code className="text-xs font-mono text-slate-800 break-words leading-relaxed whitespace-pre-wrap block">
                  {error}
                </code>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center px-8 py-5 border-t border-slate-100">
            <Button type="button" onClick={onClose} className="px-5 py-2.5">
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={onUploadDifferentFile}
              className="font-bold text-sm px-5 py-2.5 gap-2"
            >
              <Icon name="upload_file" className="text-lg" />
              Upload Different File
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
