import { Fragment } from "react";
import { twMerge } from "tailwind-merge";

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
                  <FieldLabel htmlFor={`${field.name}[0].firstName`}>
                    Authors
                  </FieldLabel>
                  <Button
                    type="button"
                    onClick={() =>
                      field.pushValue({ firstName: "", lastName: "" })
                    }
                    className="text-xs rounded gap-0.5 py-1 pl-2 pr-2.5"
                  >
                    <Icon
                      name="add"
                      weight={500}
                      className="text-base rounded"
                    />
                    Add
                  </Button>
                </div>
                <div
                  className={twMerge(
                    "grid grid-cols-[1fr_1fr_auto] items-start gap-3",
                    field.state.value.length === 1 && "grid-cols-2",
                  )}
                >
                  {field.state.value.map((_, i) => (
                    <Fragment key={i}>
                      <form.AppField
                        name={`${field.name}[${i}].firstName`}
                        children={(field) => (
                          <field.InputField placeholder="First name" />
                        )}
                      />

                      <form.AppField
                        name={`${field.name}[${i}].lastName`}
                        children={(field) => (
                          <field.InputField placeholder="Last name" />
                        )}
                      />
                      {field.state.value.length > 1 && (
                        <div className="h-11.5 flex items-center -ml-2">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => field.removeValue(i)}
                            className="text-neutral-400 hover:text-neutral-600 p-2"
                          >
                            <Icon
                              name="remove"
                              weight={500}
                              className="text-xl"
                            />
                          </Button>
                        </div>
                      )}
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
