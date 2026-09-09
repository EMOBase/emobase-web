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
                  file.name.replace(/\.(gz|gzip)$/i, "").replace(/\.\w+$/, ""),
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

        <form.AppField
          name="category"
          children={(field) => (
            <field.InputField
              label="Category"
              optional
              hint="Tracks with the same category will be grouped together inside JBrowse2"
              className="bg-white py-2 px-3 text-sm h-10"
            />
          )}
        />

        <form.AppField
          name="selectInDefaultSession"
          children={(field) => (
            <field.CheckboxField
              label="Select in default session"
              hint="When enabled, this track will be already visible the first time a user opens the genome browser"
            />
          )}
        />
      </form>
    );
  },
});

export default AddJBrowseTrackForm;
