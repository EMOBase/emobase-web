import { useForm } from "@tanstack/react-form";
import * as z from "zod";

import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
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
  close?: boolean;
};

const defaultMeta: FormMeta = {
  close: false,
};

const ProposeTermForm = ({
  id,
  ref,
  firstInputRef,
  gene,
  closeForm,
}: {
  id: string;
  ref: React.Ref<HTMLFormElement>;
  firstInputRef: React.Ref<HTMLInputElement>;
  gene: string;
  closeForm: () => void;
}) => {
  const addGOAnnotation = useGOAnnotations((state) => state.add);

  const form = useForm({
    defaultValues,
    validators: {
      onChange: formSchema,
    },
    onSubmitMeta: defaultMeta,
    onSubmit: async ({ value, meta }) => {
      addGOAnnotation({
        gene,
        ...value,
      }).then(() => {
        if (meta.close) closeForm();
      });
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
        console.log("submitter value", submitterValue);
        form.handleSubmit({ close: submitterValue === "submit&close" });
      }}
      className="space-y-6"
    >
      <form.Field
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
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={field.handleChange}
            />
          );
        }}
      />

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
                <InputGroup>
                  <InputGroupInput
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="e.g. 18586236"
                    autoComplete="off"
                  />
                  <InputGroupAddon align="inline-start">
                    <span className="text-muted-foreground">PMID:</span>
                  </InputGroupAddon>
                </InputGroup>
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
