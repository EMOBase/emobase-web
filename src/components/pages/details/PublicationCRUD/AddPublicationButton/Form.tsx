import { useState, Fragment } from "react";
import * as z from "zod";

import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAppForm } from "@/hooks/form/useAppForm";

const hints = {
  reference:
    "Complete reference in ANSI/NISO Z39.29-2005 (R2010) Bibliographic References standard (PubMed citation format)",
};

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
    message: `PubMed ID is required. If your publication isn't on PubMed, pls check the box "My publication is not on PubMed"`,
    path: ["pmid"],
  });

type FormValues = z.infer<typeof formSchema>;

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

const AddPublicationForm = ({ id }: { id: string }) => {
  const [isManual, setIsManual] = useState(false);

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      console.log("handle submit", { value });
    },
  });

  return (
    <form
      id={id}
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
        <input
          checked={isManual}
          onChange={(e) => setIsManual(e.target.checked)}
          className="w-4 h-4 rounded border-neutral-300 text-[#ff6600] focus:ring-[#ff6600] cursor-pointer"
          id="manual-entry-toggle"
          type="checkbox"
        />
        <label
          className="text-sm font-medium text-neutral-700 cursor-pointer"
          htmlFor="manual-entry-toggle"
        >
          My publication is not on PubMed
        </label>
      </div>

      {!isManual ? (
        <>
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <p className="text-sm text-blue-700 leading-relaxed">
              Enter the PubMed id of the publication. If valid, you will see
              other fields automatically filled out. You can also enter all the
              fields manually.
            </p>
          </div>
          <form.AppField
            name="pmid"
            children={(field) => (
              <field.InputGroupField
                label="PubMed ID"
                placeholder="e.g. 18586236"
                leftAddon="PMID:"
              />
            )}
          />
        </>
      ) : (
        <>
          <FieldGroup>
            <form.Field
              name="authors"
              mode="array"
              children={(field) => {
                return (
                  <Field>
                    <div className="flex justify-between">
                      <FieldLabel htmlFor={field.name}>Authors</FieldLabel>
                      <Button
                        onClick={() =>
                          field.pushValue({ firstName: "", lastName: "" })
                        }
                      >
                        Add
                      </Button>
                    </div>
                    <div className="grid grid-cols-[1fr_1fr_auto] gap-3">
                      {field.state.value.map((_, i) => (
                        <Fragment key={i}>
                          <form.Field name={`authors[${i}].firstName`}>
                            {(subField) => {
                              const isInvalid =
                                subField.state.meta.isTouched &&
                                !subField.state.meta.isValid;

                              return (
                                <Input
                                  id={subField.name}
                                  name={subField.name}
                                  value={subField.state.value}
                                  onBlur={subField.handleBlur}
                                  onChange={(e) =>
                                    subField.handleChange(e.target.value)
                                  }
                                  placeholder="First name"
                                  aria-invalid={isInvalid}
                                  autoComplete="off"
                                />
                              );
                            }}
                          </form.Field>
                          <form.Field key={i} name={`authors[${i}].lastName`}>
                            {(subField) => {
                              const isInvalid =
                                subField.state.meta.isTouched &&
                                !subField.state.meta.isValid;

                              return (
                                <Input
                                  id={subField.name}
                                  name={subField.name}
                                  value={subField.state.value}
                                  onBlur={subField.handleBlur}
                                  onChange={(e) =>
                                    subField.handleChange(e.target.value)
                                  }
                                  placeholder="Last name"
                                  aria-invalid={isInvalid}
                                  autoComplete="off"
                                />
                              );
                            }}
                          </form.Field>
                          <Button onClick={() => field.removeValue(i)}>
                            <Icon name="remove" />
                          </Button>
                        </Fragment>
                      ))}
                    </div>
                  </Field>
                );
              }}
            />
          </FieldGroup>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <form.AppField
              name="doi"
              children={(field) => <field.InputField label="DOI" />}
            />
            <form.AppField
              name="year"
              children={(field) => <field.InputField label="Year" />}
            />
          </div>
          <form.AppField
            name="title"
            children={(field) => <field.InputField label="Title" />}
          />
          <form.AppField
            name="journal"
            children={(field) => <field.InputField label="Journal" />}
          />
          <form.AppField
            name="abstract"
            children={(field) => <field.TextareaField label="Abstract" />}
          />
          <form.AppField
            name="reference"
            children={(field) => (
              <field.TextareaField
                label="Complete reference"
                hint={hints.reference}
                className="min-h-25"
              />
            )}
          />
        </>
      )}
    </form>
  );
};

export default AddPublicationForm;
