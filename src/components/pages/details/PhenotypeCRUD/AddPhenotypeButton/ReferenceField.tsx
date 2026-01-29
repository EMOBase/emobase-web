import { useStore } from "@tanstack/react-form";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { REFERENCE_TYPES } from "@/utils/constants/phenotype";
import { withForm } from "@/hooks/form/useAppForm";

import formOptions from "./formOptions";

const ReferenceField = withForm({
  ...formOptions,
  render: ({ form }) => {
    const referenceType = useStore(
      form.store,
      (state) => state.values.reference.type,
    );

    const placeholder = {
      DOI: "e.g. 10.1016/j.ydbio.2008.05.527",
      PMID: "e.g. 19187761",
      LAB: "e.g. Gregor Bucher's lab",
    }[referenceType];

    const referenceTypeAddon = (
      <InputGroupAddon align="inline-start" className="text-neutral-600 p-0">
        <form.AppField
          name="reference.type"
          children={(field) => (
            <field.SelectField
              items={REFERENCE_TYPES}
              wrapperClassName="w-24"
              className="border-y-0 border-l-0 rounded-r-none"
            />
          )}
        />
      </InputGroupAddon>
    );

    return (
      <form.AppField
        name="reference.value"
        children={(field) => (
          <field.InputGroupField
            label="Reference"
            placeholder={placeholder}
            customAddons={referenceTypeAddon}
          />
        )}
      />
    );
  },
});

export default ReferenceField;
