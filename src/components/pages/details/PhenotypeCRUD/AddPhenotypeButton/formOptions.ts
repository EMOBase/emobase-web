import { formOptions } from "@tanstack/react-form";
import * as z from "zod";
import type { ZodType } from "zod";

import {
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
  concentration: z.number().gt(0, "Concentration is invalid"),
  injectedStage: z.string().min(1, "Injected stage is required"),
  injectedStrain: z.string().min(1, "Injected strain is required"),
  description: z.string().min(1, "Phenotype description is required"),
  numberOfAnimals: z.number().gt(0, "Number of animals is invalid").optional(),
  penetrance: numericEnum(PENETRANCES),
  process: z.string().optional(),
  comment: z.string().optional(),
  reference: z.object({
    type: z.enum(REFERENCE_TYPES),
    value: z.string(),
  }),
  structure: z.object({
    termId: z.string().optional(),
    termName: z.string(),
  }),
});

export type FormValues = z.infer<typeof formSchema>;

const defaultValues: FormValues = {
  dsRNA: {
    name: OTHER_DSRNA,
  },
  concentration: 0,
  injectedStage: "",
  injectedStrain: "",
  description: "",
  penetrance: 1.0,
  reference: {
    type: "DOI",
    value: "",
  },
  structure: {
    termName: "",
  },
};

const publicationFormOptions = formOptions({
  defaultValues,
  validators: {
    onChange: formSchema,
  },
});

export default publicationFormOptions;
