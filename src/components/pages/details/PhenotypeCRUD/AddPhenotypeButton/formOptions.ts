import { formOptions } from "@tanstack/react-form";
import * as z from "zod";

const formSchema = z
  .object({
    onPubmed: z.boolean(),
    pmid: z.string(),
    authors: z.array(
      z.object({
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().min(1, "Last name is required"),
      }),
    ),
    title: z.string().min(1, "Title is required"),
    journal: z.string().min(1, "Journal is required"),
    year: z.string().min(1, "Year is required"),
    doi: z.string().min(1, "DOI is required"),
    abstract: z.string().min(1, "Abstract is required"),
    reference: z.string().min(1, "Reference is required"),
  })
  .refine((data) => !data.onPubmed || !!data.pmid, {
    message: `PubMed ID is required. If your publication isn't on PubMed, pls uncheck the box "My publication is on PubMed"`,
    path: ["pmid"],
  });

export type FormValues = z.infer<typeof formSchema>;

const defaultValues: FormValues = {
  onPubmed: true,
  authors: [{ firstName: "", lastName: "" }],
  pmid: "",
  title: "",
  journal: "",
  year: "",
  doi: "",
  abstract: "",
  reference: "",
};

const publicationFormOptions = formOptions({
  defaultValues,
  validators: {
    onChange: formSchema,
  },
});

export default publicationFormOptions;
