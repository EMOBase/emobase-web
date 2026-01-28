import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";

import type { IBDsRNA } from "@/utils/constants/ibeetle";
import { withForm } from "@/hooks/form/useAppForm";

import formOptions from "./formOptions";
import DsRNAField from "./DsRNAField";

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
      </form>
    );
  },
});

export default AddPhenotypeForm;
