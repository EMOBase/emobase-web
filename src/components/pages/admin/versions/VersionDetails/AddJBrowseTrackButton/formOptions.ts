import { formOptions } from "@tanstack/react-form";
import * as z from "zod";

const formSchema = z
  .object({
    file: z.instanceof(File).optional(),
    trackName: z.string().min(1, "Please enter a track name"),
  })
  .refine((data) => data.file !== undefined, {
    message: "Please select a file to upload",
    path: ["file"],
  });

export const formToApiSchema = formSchema.transform((v) => {
  if (!v.file) {
    throw new Error("Please select a file to upload");
  }

  return {
    file: v.file,
    trackName: v.trackName.trim(),
  };
});

export type FormValues = z.infer<typeof formSchema>;

const defaultValues: FormValues = {
  trackName: "",
};

const formOptionsInstance = formOptions({
  defaultValues,
  validators: {
    onChange: formSchema,
  },
});

export default formOptionsInstance;
