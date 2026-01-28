import { withForm } from "@/hooks/form/useAppForm";

import formOptions from "./formOptions";

const AddPhenotypeForm = withForm({
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
        <div>form fields</div>
      </form>
    );
  },
});

export default AddPhenotypeForm;
