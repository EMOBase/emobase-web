import { withForm } from "@/hooks/form/useAppForm";

import formOptions from "./formOptions";
import { SourceFileFieldContent } from "./SourceFileField";

const AddJBrowseTrackForm = withForm({
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
        <form.AppField
          name="file"
          children={(field) => (
            <SourceFileFieldContent
              field={field}
              onFileSelect={(file) => {
                form.setFieldValue(
                  "trackName",
                  file.name.replace(/\.bw$/i, ""),
                );
              }}
            />
          )}
        />

        <form.AppField
          name="trackName"
          children={(field) => (
            <field.InputField
              label="Track Name"
              type="text"
              className="bg-white py-2 px-3 text-sm h-10"
            />
          )}
        />
      </form>
    );
  },
});

export default AddJBrowseTrackForm;
