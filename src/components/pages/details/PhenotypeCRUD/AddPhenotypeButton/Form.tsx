import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";

import type { IBDsRNA } from "@/utils/constants/ibeetle";
import { STAGES } from "@/utils/constants/phenotype";
import { withForm } from "@/hooks/form/useAppForm";

import formOptions from "./formOptions";
import DsRNAField from "./DsRNAField";
import ReferenceField from "./ReferenceField";

const AddPhenotypeForm = withForm({
  ...formOptions,
  props: {
    gene: "",
    dsRNAs: [] as IBDsRNA[],
  },
  render: ({ form, gene, dsRNAs }) => {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-6"
      >
        <Field>
          <FieldLabel htmlFor="gene">Gene</FieldLabel>
          <Input
            id="gene"
            value={gene}
            readOnly
            className="border-neutral-200 bg-neutral-50 text-sm text-neutral-500 cursor-not-allowed dark:bg-neutral-800/50 dark:border-neutral-700 dark:text-neutral-400 focus-visible:ring-0 focus-visible:border-neutral-300"
          />
        </Field>
        <DsRNAField form={form} iBeetleDsRNAs={dsRNAs} />
        <form.AppField
          name="concentration"
          children={(field) => (
            <field.InputGroupField
              label="Concentration"
              type="number"
              rightAddon="ng/μl"
              singleError
            />
          )}
        />
        <div className="grid grid-cols-2 gpa-y-6 gap-x-5">
          <form.AppField
            name="injectedStage"
            children={(field) => (
              <field.SelectField items={STAGES} label="Injected stage" />
            )}
          />
          <form.AppField
            name="injectedStrain"
            children={(field) => (
              <field.InputField
                label="Injected strain"
                placeholder="e.g. Ga-2, SB, vw, pearl, ..."
              />
            )}
          />
        </div>
        <ReferenceField form={form} />
        <form.AppField
          name="description"
          children={(field) => (
            <field.TextareaField
              label="Phenotype description"
              placeholder="e.g. head not present, limbs shortened..."
              className="min-h-20"
            />
          )}
        />
        <form.AppField
          name="structure"
          children={(field) => <field.InputField label="Affected structure" />}
        />
        <form.AppField
          name="process"
          children={(field) => (
            <field.InputField
              label="Affected process"
              optional
              placeholder="e.g. head development, oogenesis..."
            />
          )}
        />
      </form>
    );
  },
});

export default AddPhenotypeForm;
