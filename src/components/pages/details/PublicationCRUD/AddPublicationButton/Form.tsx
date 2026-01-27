import { useState } from "react";

import { useAppForm } from "@/hooks/form/useAppForm";

import formOptions from "./formOptions";
import AuthorsField from "./AuthorsField";

const hints = {
  reference:
    "Complete reference in ANSI/NISO Z39.29-2005 (R2010) Bibliographic References standard (PubMed citation format)",
};

const AddPublicationForm = ({ id }: { id: string }) => {
  const [isManual, setIsManual] = useState(false);

  const form = useAppForm({
    ...formOptions,
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
