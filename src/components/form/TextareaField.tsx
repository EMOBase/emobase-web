import { useStore } from "@tanstack/react-form";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useFieldContext } from "@/hooks/form/useFormContext";

const TextareField = ({
  label,
  hint,
  link,
  optional,
  wrapperClassName,
  labelClassName,
  ...props
}: {
  label?: string;
  hint?: string;
  link?: string;
  optional?: boolean;
  wrapperClassName?: string;
  labelClassName?: string;
} & Omit<React.ComponentProps<typeof Textarea>, "value" | "onChange">) => {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const errors = useStore(field.store, (state) => state.meta.errors);
  return (
    <FieldGroup>
      <Field data-invalid={isInvalid} className={wrapperClassName}>
        {label && (
          <FieldLabel
            htmlFor={field.name}
            hint={hint}
            link={link}
            optional={optional}
            className={labelClassName}
          >
            {label}
          </FieldLabel>
        )}
        <Textarea
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

export default TextareField;
