import { withForm } from "@/hooks/form/useAppForm";

import formOptions from "./formOptions";
import SourceFileField from "./SourceFileField";

const AddOrthologyForm = withForm({
  ...formOptions,
  render: ({ form }) => {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-6"
      >
        <SourceFileField form={form} />

        <form.AppField
          name="order"
          children={(field) => (
            <field.InputField
              label="Display Order"
              type="number"
              min="1"
              step="1"
              placeholder="e.g., 1"
              className="bg-white py-2 px-3 text-sm h-10"
            />
          )}
        />

        <form.AppField
          name="algorithm"
          children={(field) => (
            <field.InputField
              label="Algorithm"
              type="text"
              placeholder="e.g., OrthoFinder 2.0"
              className="bg-white py-2 px-3 text-sm h-10"
            />
          )}
        />
      </form>
    );
  },
});

export default AddOrthologyForm;
