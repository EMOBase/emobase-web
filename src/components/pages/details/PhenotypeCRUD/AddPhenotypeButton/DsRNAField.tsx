import { useEffect } from "react";
import { useStore } from "@tanstack/react-form";

import { Field, FieldLabel } from "@/components/ui/field";
import { withForm } from "@/hooks/form/useAppForm";
import { OTHER_DSRNA, type Phenotype } from "@/utils/constants/phenotype";

import type { IBDsRNA } from "@/utils/constants/ibeetle";

import formOptions from "./formOptions";

const getSequenceLookup = (iBeetleDsRNAs: IBDsRNA[]) => {
  const lookup: Record<string, string> = {
    OTHER_DSRNA: "",
  };
  for (const dsRNA of iBeetleDsRNAs) {
    lookup[dsRNA.id] = dsRNA.seq;
  }
  return lookup;
};

const DsRNAField = withForm({
  ...formOptions,
  props: {
    iBeetleDsRNAs: [] as IBDsRNA[],
  },
  render: ({ form, iBeetleDsRNAs }) => {
    const dsRNA = useStore(form.store, (state) => state.values.dsRNA);
    const dsRNASequenceLookup = getSequenceLookup(iBeetleDsRNAs);

    const dsRNAName = useStore(form.store, (state) => state.values.dsRNA.name);

    useEffect(() => {
      if (dsRNAName) {
        form.setFieldValue("dsRNA.sequence", dsRNASequenceLookup[dsRNAName]);
      }
    }, [dsRNAName]);

    const radioItems = [{ value: OTHER_DSRNA, label: "New sequence" }]
      .concat(
        iBeetleDsRNAs.map(({ id }) => ({
          value: id,
          label: id,
        })),
      )
      .concat({
        value: "",
        label: "iB_05451",
      });

    return (
      <Field>
        <FieldLabel hint="The dsRNA injected into the animals to obtain the phenotype">
          dsRNA
        </FieldLabel>
        <form.AppField
          name="dsRNA.name"
          children={(field) => (
            <field.RadioGroupField
              items={radioItems}
              orientation="horizontal"
            />
          )}
        />
      </Field>
    );
  },
});

export default DsRNAField;
