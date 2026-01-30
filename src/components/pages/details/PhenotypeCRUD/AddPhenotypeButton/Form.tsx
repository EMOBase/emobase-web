import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";

import type { IBDsRNA } from "@/utils/constants/ibeetle";
import { STAGES, PENETRANCES } from "@/utils/constants/phenotype";
import { withForm } from "@/hooks/form/useAppForm";

import formOptions from "./formOptions";
import DsRNAField from "./DsRNAField";
import ReferenceField from "./ReferenceField";
import StructureField from "./StructureField";
import ImagesField from "./ImagesField";

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
        <StructureField form={form} />
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
        <div className="grid grid-cols-[2fr_3fr] gap-y-6 gap-x-5">
          <form.AppField
            name="penetrance"
            children={(field) => (
              <field.SelectField
                items={PENETRANCES.map((p) => ({
                  value: p.toString(),
                  label: `${p * 100}%`,
                }))}
                value={field.state.value.toString()}
                onChange={(v) =>
                  field.handleChange(Number(v) as typeof field.state.value)
                }
                label="Penetrance"
                hint="What portion of analyzed specimen showed the phenotype"
              />
            )}
          />
          <form.AppField
            name="numberOfAnimals"
            children={(field) => (
              <field.InputField
                label="Number of animals analysed"
                optional
                type="number"
                placeholder="e.g. 50"
              />
            )}
          />
        </div>
        <form.AppField
          name="comment"
          children={(field) => (
            <field.TextareaField
              label="Comment"
              optional
              placeholder="Any additional observations..."
              className="min-h-25"
            />
          )}
        />
        <ImagesField form={form} />
      </form>
    );
  },
});

export default AddPhenotypeForm;
