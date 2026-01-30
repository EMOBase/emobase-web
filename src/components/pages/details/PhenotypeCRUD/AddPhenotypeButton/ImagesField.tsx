import { useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

import { Icon } from "@/components/ui/icon";
import { Field, FieldLabel } from "@/components/ui/field";
import { withForm } from "@/hooks/form/useAppForm";

import formOptions from "./formOptions";

const extractFileName = (file: File) => {
  const parts = file.name.split(".");
  const extension = parts.pop();
  const name = parts.join(".");

  return { name, extension };
};

const ImagesField = withForm({
  ...formOptions,
  render: ({ form }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

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
      if (droppedFiles) {
        form.setFieldValue("imageFiles", [...droppedFiles]);
      }
    };

    return (
      <form.AppField
        name="imageFiles"
        children={(field) => (
          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel hint="You can upload multiple images" optional>
                Upload images
              </FieldLabel>
              {field.state.value.length > 0 && (
                <button
                  type="button"
                  onClick={() => field.handleChange([])}
                  className="text-[11px] font-medium text-neutral-400 hover:text-primary transition-colors uppercase tracking-wider cursor-pointer"
                >
                  Clear all
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                if (e.target.files) {
                  const selectedFiles = [...e.target.files];
                  field.handleChange((current) =>
                    current.concat(selectedFiles),
                  );
                }
              }}
              className="hidden"
            />
            <div
              className={twMerge(
                "border-2 border-dashed border-neutral-200 rounded-xl p-8 flex flex-col items-center justify-center bg-neutral-50 hover:bg-neutral-100 transition-colors cursor-pointer group",
                isDragOver && "outline-dashed outline-2 outline-primary",
                field.state.value.length > 0 && "gap-2",
              )}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {field.state.value.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 min-h-20">
                  {field.state.value.map((file, index) => {
                    const { name, extension } = extractFileName(file);

                    return (
                      <div
                        key={index}
                        className="flex flex-col gap-1.5 group cursor-default"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="relative aspect-square rounded-lg overflow-hidden border border-neutral-200 shadow-sm bg-neutral-100">
                          <img
                            alt={file.name}
                            className="w-full h-full object-cover"
                            src={URL.createObjectURL(file)}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              field.handleChange((current) =>
                                current.toSpliced(index, 1),
                              )
                            }
                            className="absolute top-1 right-1 size-6 bg-white/90 rounded-full shadow-md flex items-center justify-center text-neutral-500 hover:bg-neutral-100/90 hover:text-neutral-600 transition-colors cursor-pointer"
                          >
                            <Icon
                              name="close"
                              weight={600}
                              className="text-base"
                            />
                          </button>
                        </div>
                        <span className="inline-flex text-[10px] text-neutral-500 px-1">
                          <span className="truncate">{name}</span>.
                          <span>{extension}</span>
                        </span>
                      </div>
                    );
                  })}
                  <button
                    type="button"
                    className="aspect-square rounded-lg border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center bg-white hover:bg-neutral-100 transition-colors group"
                  >
                    <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">
                      add
                    </span>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter mt-1">
                      Add more
                    </span>
                  </button>
                </div>
              ) : (
                <>
                  <div className="size-12 rounded-full bg-white flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-primary">
                      photo_camera
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 font-bold">
                    Add Phenotype Images
                  </p>
                </>
              )}
              <p className="text-[11px] text-neutral-400 mt-2 text-center max-w-80">
                Note: Only images that have not been previously published or for
                which the rights allow publication may be uploaded.
              </p>
            </div>
          </Field>
        )}
      />
    );
  },
});

export default ImagesField;
