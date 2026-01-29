import * as z from "zod";
import { toast } from "sonner";

import { useAppForm } from "@/hooks/form/useAppForm";
import { GENE_PRODUCTS, GO_ASPECTS } from "@/utils/constants/goannotation";

import useGOAnnotations from "../useGOAnnotations";
import TermInputField from "./TermInputField";

const hints = {
  goId: "The ID of the GO term you assign to the gene product.",
  evidence:
    "The evidence code describes with which method the function or location expressed by the GO term, was show for this gene product.",
  pmid: "The PubMed ID of the publication where the function or location is described for the gene product.",
  quotation:
    "If you paste here the relevant section of the reference, it is for us a great help to review your annotation. The quotation may be also be displayed to the users of iBeetle-Base.",
  name: "Name of the person who is contributing this data. The contact information can help us to clarify any question.",
  email:
    "We will use your email address only for possible questions regarding this annotation. We will never show your address or give it away.",
  namePublished:
    "If you have entered your name and agree by marking the checkbox, we might show your name on this page to honor your contribution.",
};

const formSchema = z.object({
  term: z
    .object({
      id: z.string(),
      name: z.string(),
      aspect: z.enum(["", ...GO_ASPECTS] as const),
    })
    .refine((data) => data.id !== "GO:", "GO ID is required")
    .refine((data) => !!data.name && data.aspect, "GO ID is invalid"),
  geneProduct: z.enum(GENE_PRODUCTS),
  evidence: z.string().min(1, "Evidence code is required"),
  pmid: z.string().min(1, "PubMed ID is required"),
  quotation: z.string().max(500, "Quotation is too long"),
  lab: z.string().min(1, "Lab is required"),
});

type FormValues = z.infer<typeof formSchema>;

const defaultValues: FormValues = {
  term: {
    id: "GO:",
    name: "",
    aspect: "",
  },
  geneProduct: "protein",
  evidence: "",
  pmid: "",
  quotation: "",
  lab: "",
};

type FormMeta = {
  shouldClose?: boolean;
};

const defaultMeta: FormMeta = {
  shouldClose: false,
};

const ProposeTermForm = ({
  id,
  ref,
  firstInputRef,
  gene,
  closeForm,
  setSubmittingType,
}: {
  id: string;
  ref?: React.Ref<HTMLFormElement>;
  firstInputRef: React.Ref<HTMLInputElement>;
  gene: string;
  closeForm: () => void;
  setSubmittingType: (value: "keep" | "close" | null) => void;
}) => {
  const addGOAnnotation = useGOAnnotations((state) => state.add);

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: formSchema,
    },
    onSubmitMeta: defaultMeta,
    onSubmit: async ({ value, meta }) => {
      setSubmittingType(meta.shouldClose ? "close" : "keep");
      await addGOAnnotation({
        gene,
        ...value,
      });
      toast.success("GO Annotation proposed");
      setSubmittingType(null);
      if (meta.shouldClose) closeForm();
    },
  });

  return (
    <form
      ref={ref}
      id={id}
      onSubmit={(e) => {
        e.preventDefault();
        let submitterValue = null;
        if (e.nativeEvent instanceof SubmitEvent) {
          const submitter = e.nativeEvent.submitter;
          if (
            submitter instanceof HTMLButtonElement ||
            submitter instanceof HTMLInputElement
          ) {
            submitterValue = submitter.value;
          }
        }
        form.handleSubmit({ shouldClose: submitterValue === "submit&close" });
      }}
      className="space-y-6"
    >
      <form.AppField
        name="term"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <TermInputField
              ref={firstInputRef}
              isInvalid={isInvalid}
              errors={field.state.meta.errors}
              id={field.name}
              name={field.name}
              label="GO ID"
              hint={hints.goId}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={field.handleChange}
            />
          );
        }}
      />

      <form.AppField
        name="geneProduct"
        children={(field) => (
          <field.SelectField items={GENE_PRODUCTS} label="Gene product" />
        )}
      />

      <form.AppField
        name="evidence"
        children={(field) => (
          <field.InputField
            label="Evidence code"
            hint={hints.evidence}
            link="http://geneontology.org/docs/guide-go-evidence-codes/"
            placeholder="e.g. IMP"
          />
        )}
      />

      <form.AppField
        name="pmid"
        children={(field) => (
          <field.InputGroupField
            label="PubMed ID"
            hint={hints.pmid}
            placeholder="e.g. 18586236"
            leftAddon="PMID:"
          />
        )}
      />

      <form.AppField
        name="quotation"
        children={(field) => (
          <field.TextareaField
            label="Quotation"
            hint={hints.quotation}
            placeholder="Relevant section from the publication"
          />
        )}
      />

      <form.AppField
        name="lab"
        children={(field) => <field.InputField label="Lab name" />}
      />
    </form>
  );
};

export default ProposeTermForm;
