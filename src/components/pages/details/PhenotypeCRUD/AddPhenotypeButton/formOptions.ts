import { formOptions } from "@tanstack/react-form";
import * as z from "zod";
import type { ZodType } from "zod";

import {
  STAGES,
  PENETRANCES,
  REFERENCE_TYPES,
  OTHER_DSRNA,
} from "@/utils/constants/phenotype";

function numericEnum<TValues extends readonly number[]>(values: TValues) {
  return z.number().superRefine((val, ctx) => {
    if (!values.includes(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_enum_value,
        options: [...values],
        received: val,
      });
    }
  }) as ZodType<TValues[number]>;
}

const formSchema = z.object({
  dsRNA: z.object({
    name: z.string().optional(),
    sequence: z.string().optional(),
  }),
  concentration: z
    .string()
    .min(1, "Concentration is required")
    .refine(
      (v) => !Number.isNaN(v) && Number(v) > 0,
      "Concentration is invalid",
    ),
  injectedStage: z
    .enum(["", ...STAGES] as const)
    .refine((v) => v.length > 0, "Injected stage is required"),
  injectedStrain: z.string().min(1, "Injected strain is required"),
  description: z.string().min(1, "Phenotype description is required"),
  numberOfAnimals: z.number().gt(0, "Number of animals is invalid").optional(),
  penetrance: numericEnum([-1, ...PENETRANCES] as const).refine(
    (v) => v > -1,
    "Penetrance is required",
  ),
  process: z.string().optional(),
  comment: z.string().optional(),
  reference: z.object({
    type: z.enum(REFERENCE_TYPES),
    value: z.string().min(1, "Reference is required"),
  }),
  structure: z
    .object({
      termId: z.string().optional(),
      termName: z.string(),
    })
    .refine((v) => !!v.termName, "Structure is required"),
  imageFiles: z.array(z.instanceof(File)),
});

export type FormValues = z.infer<typeof formSchema>;

const defaultValues: FormValues = {
  dsRNA: {
    name: OTHER_DSRNA,
  },
  concentration: "",
  injectedStage: "",
  injectedStrain: "",
  description: "",
  penetrance: -1,
  reference: {
    type: "DOI",
    value: "",
  },
  structure: {
    termName: "",
  },
  imageFiles: [],
};

const publicationFormOptions = formOptions({
  defaultValues,
  validators: {
    onChange: formSchema,
  },
});

export default publicationFormOptions;
