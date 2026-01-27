import { useStore } from "@tanstack/react-form";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useFieldContext } from "@/hooks/form/useFormContext";

const InputGroupField = ({
  label,
  hint,
  link,
  leftAddon,
  rightAddon,
  ...props
}: {
  label?: string;
  hint?: string;
  link?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
} & Omit<
  React.ComponentProps<typeof InputGroupInput>,
  "value" | "onChange"
>) => {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const errors = useStore(field.store, (state) => state.meta.errors);
  return (
    <FieldGroup>
      <Field data-invalid={isInvalid}>
        {label && (
          <FieldLabel htmlFor={field.name} hint={hint} link={link}>
            {label}
          </FieldLabel>
        )}
        <InputGroup>
          <InputGroupInput
            id={field.name}
            name={field.name}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            aria-invalid={isInvalid}
            autoComplete="off"
            {...props}
          />
          {leftAddon && (
            <InputGroupAddon align="inline-start">
              <span className="text-muted-foreground">{leftAddon}</span>
            </InputGroupAddon>
          )}
          {rightAddon && (
            <InputGroupAddon align="inline-end">
              <span className="text-muted-foreground">{rightAddon}</span>
            </InputGroupAddon>
          )}
        </InputGroup>
        {isInvalid && <FieldError errors={errors} />}
      </Field>
    </FieldGroup>
  );
};

export default InputGroupField;
