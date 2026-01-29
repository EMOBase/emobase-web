import { useStore } from "@tanstack/react-form";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useFieldContext } from "@/hooks/form/useFormContext";

const InputField = ({
  label,
  hint,
  link,
  optional,
  ...props
}: {
  label?: string;
  hint?: string;
  link?: string;
  optional?: boolean;
} & Omit<React.ComponentProps<typeof Input>, "value" | "onChange">) => {
  const field = useFieldContext<string>();
  const isInvalid = useStore(
    field.store,
    (state) => state.meta.isTouched && !state.meta.isValid,
  );
  const errors = useStore(field.store, (state) => state.meta.errors);

  return (
    <FieldGroup>
      <Field data-invalid={isInvalid}>
        {label && (
          <FieldLabel
            htmlFor={field.name}
            hint={hint}
            link={link}
            optional={optional}
          >
            {label}
          </FieldLabel>
        )}
        <Input
          id={field.name}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          aria-invalid={isInvalid}
          autoComplete="off"
          {...props}
        />
        {isInvalid && <FieldError errors={errors} />}
      </Field>
    </FieldGroup>
  );
};

export default InputField;
