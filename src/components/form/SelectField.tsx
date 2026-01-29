import { useStore } from "@tanstack/react-form";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useFieldContext } from "@/hooks/form/useFormContext";

const SelectField = ({
  items,
  label,
  hint,
  link,
  wrapperClassName,
  ...props
}: {
  items: ReadonlyArray<string> | string[];
  label?: string;
  hint?: string;
  link?: string;
  wrapperClassName?: string;
} & Omit<
  React.ComponentProps<typeof SelectTrigger>,
  "value" | "onValueChange"
>) => {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const errors = useStore(field.store, (state) => state.meta.errors);
  return (
    <FieldGroup className={wrapperClassName}>
      <Field data-invalid={isInvalid}>
        {label && (
          <FieldLabel htmlFor={field.name} hint={hint} link={link}>
            {label}
          </FieldLabel>
        )}
        <Select
          name={field.name}
          value={field.state.value}
          onValueChange={(v) => field.handleChange(v)}
        >
          <SelectTrigger aria-invalid={isInvalid} {...props}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {items.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isInvalid && <FieldError errors={errors} />}
      </Field>
    </FieldGroup>
  );
};

export default SelectField;
