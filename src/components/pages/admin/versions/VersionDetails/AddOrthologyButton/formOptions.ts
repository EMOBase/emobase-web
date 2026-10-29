import { formOptions } from "@tanstack/react-form";
import * as z from "zod";

const formSchema = z
  .object({
    file: z.instanceof(File).optional(),
    order: z
      .string()
      .min(1, "Display order is required")
      .refine(
        (v) =>
          !Number.isNaN(Number(v)) &&
          Number(v) > 0 &&
          Number.isInteger(Number(v)),
        "Please enter a valid positive integer for Display Order",
      ),
    algorithm: z.string().min(1, "Please enter an algorithm name"),
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
    order: Number(v.order),
    algorithm: v.algorithm.trim(),
  };
});

export type FormValues = z.infer<typeof formSchema>;

const defaultValues: FormValues = {
  order: "1",
  algorithm: "",
};

const orthologyFormOptions = formOptions({
  defaultValues,
  validators: {
    onChange: formSchema,
  },
});

export default orthologyFormOptions;
