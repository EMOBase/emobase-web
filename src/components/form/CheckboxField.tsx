import { useStore } from "@tanstack/react-form";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { useFieldContext } from "@/hooks/form/useFormContext";

type CheckedState = boolean | "indeterminate";

const CheckboxField = ({
  reverseValue,
  label,
  hint,
  link,
  ...props
}: {
  reverseValue?: boolean;
  onChange?: (checked: CheckedState) => void;
  label?: string;
  hint?: string;
  link?: string;
} & Omit<
  React.ComponentProps<typeof Checkbox>,
  "checked" | "onCheckedChange"
>) => {
  const field = useFieldContext<CheckedState>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const value = field.state.value;
  const handleChange = field.handleChange;

  const [checked, setChecked] = reverseValue
    ? [
        value === "indeterminate" ? value : !value,
        (c: CheckedState) => field.handleChange(c === "indeterminate" ? c : !c),
      ]
    : [value, handleChange];

  const errors = useStore(field.store, (state) => state.meta.errors);
  return (
    <FieldGroup>
      <Field orientation="horizontal" data-invalid={isInvalid}>
        <div className="flex items-center gap-2">
          <Checkbox
            id={field.name}
            name={field.name}
            checked={checked}
            onCheckedChange={setChecked}
            onBlur={field.handleBlur}
            aria-invalid={isInvalid}
            {...props}
          />
          {label && (
            <FieldLabel
              htmlFor={field.name}
              hint={hint}
              link={link}
              className="font-medium"
            >
              {label}
            </FieldLabel>
          )}
        </div>
        {isInvalid && <FieldError errors={errors} />}
      </Field>
    </FieldGroup>
  );
};

export default CheckboxField;
