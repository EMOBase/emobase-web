import { useForm } from "@tanstack/react-form";
import * as z from "zod";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { GENE_PRODUCTS } from "@/utils/constants/goannotation";

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
  goId: z.string().min(1, "GO ID is required"),
  geneProduct: z.enum(GENE_PRODUCTS),
  evidence: z.string().min(1, "Evidence code is required"),
  pmid: z.string().min(1, "PubMed ID is required"),
  quotation: z.string().max(500, "Quotation is too long"),
  lab: z.string().min(1, "Lab is required"),
});

type FormValues = z.infer<typeof formSchema>;

const defaultValues: FormValues = {
  goId: "",
  geneProduct: "protein",
  evidence: "",
  pmid: "",
  quotation: "",
  lab: "",
};

const ProposeTermForm = ({
  ref,
  firstInputRef,
}: {
  ref: React.Ref<HTMLFormElement>;
  firstInputRef: React.Ref<HTMLInputElement>;
}) => {
  const form = useForm({
    defaultValues,
    validators: {
      onBlur: formSchema,
    },
    onSubmit: async ({ value }) => {
      console.log("onSubmit", value);
    },
  });

  return (
    <form
      ref={ref}
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      <FieldGroup>
        <form.Field
          name="goId"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name} hint={hints.goId}>
                  *GO ID:
                </FieldLabel>
                <Input
                  ref={firstInputRef}
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="GO:0000000"
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
      </FieldGroup>

      <FieldGroup>
        <form.Field
          name="geneProduct"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>*Gene product</FieldLabel>
                <Select
                  name={field.name}
                  value={field.state.value}
                  onValueChange={(v) =>
                    field.handleChange(v as (typeof GENE_PRODUCTS)[number])
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GENE_PRODUCTS.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
      </FieldGroup>

      <FieldGroup>
        <form.Field
          name="evidence"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel
                  htmlFor={field.name}
                  hint={hints.evidence}
                  link="http://geneontology.org/docs/guide-go-evidence-codes/"
                >
                  *Evidence code:
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="e.g. IMP"
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
      </FieldGroup>

      <FieldGroup>
        <form.Field
          name="pmid"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name} hint={hints.pmid}>
                  *PubMed ID:
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="e.g. 18586236"
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
      </FieldGroup>

      <FieldGroup>
        <form.Field
          name="quotation"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name} hint={hints.quotation}>
                  Quotation:
                </FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Relevant section from the publication"
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
      </FieldGroup>

      <FieldGroup>
        <form.Field
          name="lab"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>*Lab name:</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
      </FieldGroup>
    </form>
  );
};

export default ProposeTermForm;
