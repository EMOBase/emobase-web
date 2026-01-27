import { Fragment } from "react";

import { withForm } from "@/hooks/form/useAppForm";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

import formOptions from "./formOptions";

const AuthorsField = withForm({
  ...formOptions,
  render: ({ form }) => {
    return (
      <FieldGroup>
        <form.AppField
          name="authors"
          mode="array"
          children={(field) => {
            return (
              <Field>
                <div className="flex justify-between">
                  <FieldLabel htmlFor={field.name}>Authors</FieldLabel>
                  <Button
                    onClick={() =>
                      field.pushValue({ firstName: "", lastName: "" })
                    }
                  >
                    Add
                  </Button>
                </div>
                <div className="grid grid-cols-[1fr_1fr_auto] items-start gap-3">
                  {field.state.value.map((_, i) => (
                    <Fragment key={i}>
                      <form.AppField
                        name={`authors[${i}].firstName`}
                        children={(field) => (
                          <field.InputField placeholder="Last name" />
                        )}
                      />

                      <form.AppField
                        name={`authors[${i}].lastName`}
                        children={(field) => (
                          <field.InputField placeholder="Last name" />
                        )}
                      />
                      <Button onClick={() => field.removeValue(i)}>
                        <Icon name="remove" />
                      </Button>
                    </Fragment>
                  ))}
                </div>
              </Field>
            );
          }}
        />
      </FieldGroup>
    );
  },
});

export default AuthorsField;
