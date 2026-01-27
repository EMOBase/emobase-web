import { useEffect } from "react";
import { useStore } from "@tanstack/react-form";

import { useAppForm } from "@/hooks/form/useAppForm";

import formOptions from "./formOptions";
import AuthorsField from "./AuthorsField";

const hints = {
  reference:
    "Complete reference in ANSI/NISO Z39.29-2005 (R2010) Bibliographic References standard (PubMed citation format)",
};

const AddPublicationForm = ({ id }: { id: string }) => {
  const form = useAppForm({
    ...formOptions,
    onSubmit: async ({ value }) => {
      console.log("handle submit", { value });
    },
  });

  const onPubmed = useStore(form.store, (state) => state.values.onPubmed);
  useEffect(() => {
    form.reset({ ...formOptions.defaultValues, onPubmed });
  }, [onPubmed]);

  return (
    <form
      id={id}
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
        <form.AppField
          name="onPubmed"
          children={(field) => (
            <field.CheckboxField
              reverseValue
              label="My publication is not on PubMed"
            />
          )}
        />
      </div>

      {onPubmed ? (
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
          <AuthorsField form={form} />
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
