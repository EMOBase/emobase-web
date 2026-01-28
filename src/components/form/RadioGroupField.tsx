import { useStore } from "@tanstack/react-form";
import { twMerge } from "tailwind-merge";

import { Label } from "@/components/ui/label";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFieldContext } from "@/hooks/form/useFormContext";

type Item = {
  value: string;
  label: string;
};

const RadioGroupField = ({
  items,
  label,
  hint,
  link,
  ...props
}: {
  items: ReadonlyArray<string> | string[] | ReadonlyArray<Item> | Item[];
  label?: string;
  hint?: string;
  link?: string;
} & Omit<
  React.ComponentProps<typeof RadioGroup>,
  "value" | "onValueChange"
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
        <RadioGroup
          name={field.name}
          value={field.state.value}
          onValueChange={(v) => field.handleChange(v)}
          {...props}
        >
          {items.map((item) => {
            const [value, label] =
              typeof item === "string"
                ? [item, item]
                : [item.value, item.label];
            const id = `${field.name}-${value}`;

            return (
              <div
                key={value}
                className={twMerge(
                  "flex items-center gap-2.5",
                  props.orientation === "horizontal" && "gap-2",
                )}
              >
                <RadioGroupItem value={value} id={id} />
                <Label htmlFor={id}>{label}</Label>
              </div>
            );
          })}
        </RadioGroup>
        {isInvalid && <FieldError errors={errors} />}
      </Field>
    </FieldGroup>
  );
};

export default RadioGroupField;
