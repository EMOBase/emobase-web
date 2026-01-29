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

type Item = {
  value: string;
  label: string;
};

const SelectField = ({
  items,
  label,
  hint,
  link,
  value: valueProp,
  onChange,
  wrapperClassName,
  ...props
}: {
  items: ReadonlyArray<string> | string[] | ReadonlyArray<Item> | Item[];
  label?: string;
  hint?: string;
  link?: string;
  value?: string;
  onChange?: (v: string) => void;
  wrapperClassName?: string;
} & Omit<React.ComponentProps<typeof SelectTrigger>, "onChange">) => {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const errors = field.state.meta.errors;

  const value = valueProp ?? field.state.value;
  const onValueChange = onChange ?? ((v: string) => field.handleChange(v));

  return (
    <FieldGroup className={wrapperClassName}>
      <Field data-invalid={isInvalid}>
        {label && (
          <FieldLabel htmlFor={field.name} hint={hint} link={link}>
            {label}
          </FieldLabel>
        )}
        <Select name={field.name} value={value} onValueChange={onValueChange}>
          <SelectTrigger aria-invalid={isInvalid} {...props}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {items.map((item) => {
              const [value, label] =
                typeof item === "string"
                  ? [item, item]
                  : [item.value, item.label];

              return (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        {isInvalid && <FieldError errors={errors} />}
      </Field>
    </FieldGroup>
  );
};

export default SelectField;
