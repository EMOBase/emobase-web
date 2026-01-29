import { useRef, useState, useEffect } from "react";
import { useStore } from "@tanstack/react-form";
import { twMerge } from "tailwind-merge";

import { Icon } from "@/components/ui/icon";
import { Field, FieldLabel } from "@/components/ui/field";
import { withForm } from "@/hooks/form/useAppForm";
import { OTHER_DSRNA } from "@/utils/constants/phenotype";

import type { IBDsRNA } from "@/utils/constants/ibeetle";

import formOptions from "./formOptions";

const getSequenceLookup = (iBeetleDsRNAs: IBDsRNA[]) => {
  const lookup: Record<string, string> = {
    OTHER_DSRNA: "",
  };
  for (const dsRNA of iBeetleDsRNAs) {
    lookup[dsRNA.id] = dsRNA.seq;
  }
  return lookup;
};

const DsRNAField = withForm({
  ...formOptions,
  props: {
    iBeetleDsRNAs: [] as IBDsRNA[],
  },
  render: ({ form, iBeetleDsRNAs }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const dsRNA = useStore(form.store, (state) => state.values.dsRNA);
    const dsRNASequenceLookup = getSequenceLookup(iBeetleDsRNAs);

    const dsRNAName = useStore(form.store, (state) => state.values.dsRNA.name);

    useEffect(() => {
      if (dsRNAName) {
        form.setFieldValue("dsRNA.sequence", dsRNASequenceLookup[dsRNAName]);
      }
    }, [dsRNAName]);

    const radioItems = [{ value: OTHER_DSRNA, label: "New sequence" }].concat(
      iBeetleDsRNAs.map(({ id }) => ({
        value: id,
        label: id,
      })),
    );

    const [chosenFile, setChosenFile] = useState<File | null>(null);

    useEffect(() => {
      if (chosenFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
          form.setFieldValue("dsRNA", {
            name: OTHER_DSRNA,
            sequence: e.target?.result?.toString() || "",
          });
        };
        reader.readAsText(chosenFile);
      } else {
        form.setFieldValue("dsRNA", {
          name: OTHER_DSRNA,
          sequence: "",
        });
      }
    }, [chosenFile]);

    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOver(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOver(false);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOver(false);

      const droppedFiles = Array.from(event.dataTransfer.files);
      if (droppedFiles && droppedFiles.length > 0) {
        setChosenFile(droppedFiles[0]);
      }
    };

    return (
      <Field>
        <FieldLabel hint="The dsRNA injected into the animals to obtain the phenotype">
          dsRNA
        </FieldLabel>
        {radioItems.length > 1 && (
          <form.AppField
            name="dsRNA.name"
            children={(field) => (
              <field.RadioGroupField
                items={radioItems}
                orientation="horizontal"
              />
            )}
          />
        )}
        {dsRNA.name === OTHER_DSRNA && (
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-xs text-neutral-500 italic">
                You can either upload the fasta file for your dsRNA...
              </p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setChosenFile(e.target.files[0]);
                  }
                }}
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className={twMerge(
                  "group/fileinput relative group border border-neutral-200 dark:border-neutral-700 rounded-lg px-4 py-3 text-sm text-neutral-400 bg-white dark:bg-neutral-800 flex items-center justify-between cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/80 transition-colors",
                  isDragOver && "outline-dashed outline-2 outline-primary",
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex items-center gap-4">
                  <Icon
                    name="attach_file"
                    className="text-[22px] text-neutral-400"
                  />
                  <span>{chosenFile ? chosenFile.name : "Upload fasta"}</span>
                </div>
                {chosenFile ? (
                  <button
                    className="cursor-pointer rounded-sm flex hover:text-neutral-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                      setChosenFile(null);
                    }}
                  >
                    <Icon name="cancel" className="text-[22px]" />
                  </button>
                ) : (
                  <span className="text-[11px] bg-neutral-100 group-hover/fileinput:bg-neutral-200 dark:bg-neutral-700 px-2 py-1 rounded text-neutral-500 dark:text-neutral-400 font-semibold uppercase tracking-tight">
                    Select file
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-neutral-500 italic">
                ... or paste the sequence below
              </p>

              <form.AppField
                name="dsRNA.sequence"
                children={(field) => (
                  <field.TextareaField
                    label="Sequence of the new dsRNA:"
                    labelClassName="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider"
                    wrapperClassName="gap-2"
                    placeholder="Paste your FASTA sequence here..."
                    className="min-h-25 font-mono text-sm md:text-xs"
                  />
                )}
              />
              <p className="text-[11px] text-neutral-400">
                Please provide the target sequence because this may influence
                the results.
              </p>
            </div>
          </div>
        )}
      </Field>
    );
  },
});

export default DsRNAField;
