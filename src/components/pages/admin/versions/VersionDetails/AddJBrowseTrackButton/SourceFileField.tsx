import { useRef, useState } from "react";
import { useStore, type AnyFieldApi } from "@tanstack/react-form";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { formatBytes } from "@/utils/format";

const isValidFile = (file: File) =>
  file.name.endsWith(".gz") || file.name.endsWith(".gzip");

export const SourceFileFieldContent = ({
  field,
  onFileSelect,
}: {
  field: AnyFieldApi;
  onFileSelect?: (file: File) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const isInvalid = useStore(
    field.store,
    (state) => state.meta.isTouched && !state.meta.isValid,
  );
  const errors = useStore(field.store, (state) => state.meta.errors);

  const file = field.state.value as File | undefined;

  const setFile = (selectedFile: File) => {
    if (!isValidFile(selectedFile)) {
      toast.error("Only .gz or .gzip files are accepted");
      return;
    }
    field.handleChange(selectedFile);
    onFileSelect?.(selectedFile);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    field.handleChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <FieldGroup>
      <Field data-invalid={isInvalid}>
        <FieldLabel htmlFor={field.name}>Source File</FieldLabel>
        <input
          id={field.name}
          name={field.name}
          type="file"
          ref={fileInputRef}
          className="hidden"
          aria-invalid={isInvalid}
          onBlur={field.handleBlur}
          onChange={(e) => {
            const selectedFile = e.target.files?.[0];
            if (selectedFile) {
              setFile(selectedFile);
            }
          }}
          accept=".gz,.gzip"
        />
        <div
          className={twMerge(
            "border-2 border-dashed border-neutral-200 rounded-lg p-8 flex flex-col items-center justify-center bg-neutral-50 hover:bg-neutral-100 transition-colors cursor-pointer group",
            isDragging && "outline-dashed outline-2 outline-primary",
            isInvalid && "border-destructive",
          )}
          aria-invalid={isInvalid}
          onClick={triggerFileSelect}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragging(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const droppedFile = e.dataTransfer.files?.[0];
            if (droppedFile) {
              setFile(droppedFile);
            }
          }}
        >
          {file ? (
            <div className="flex flex-col items-center">
              <div className="size-12 rounded-full bg-white flex items-center justify-center shadow-sm mb-3 text-primary group-hover:scale-110 transition-transform">
                <Icon name="task" className="text-2xl" weight={500} />
              </div>
              <p
                className="text-sm text-neutral-600 font-bold truncate max-w-80"
                title={file.name}
              >
                {file.name}
              </p>
              <p className="text-[11px] text-neutral-400 mt-1 text-center">
                {formatBytes(file.size)}
              </p>
              <button
                type="button"
                onClick={removeFile}
                className="text-xs font-bold text-neutral-400 hover:text-neutral-600 transition-colors mt-3 cursor-pointer"
              >
                Remove file
              </button>
            </div>
          ) : (
            <>
              <div className="size-12 rounded-full bg-white flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                <Icon
                  name="upload_file"
                  className="text-2xl text-primary"
                  weight={500}
                />
              </div>
              <p className="text-sm text-neutral-600 font-bold">
                Click to upload or drag and drop
              </p>
              <p className="text-[11px] text-neutral-400 mt-2 text-center max-w-80">
                Compressed track files (.gz, .gzip)
              </p>
            </>
          )}
        </div>
        {isInvalid && <FieldError errors={errors} />}
      </Field>
    </FieldGroup>
  );
};
