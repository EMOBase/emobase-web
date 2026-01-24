import { useState } from "react";
import { useDebounceCallback } from "usehooks-ts";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Field,
  FieldError,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import type { GOAnnotation } from "@/utils/constants/goannotation";
import { fetchById, shortenGOAspect } from "@/utils/services/ontologyService";

type Term = GOAnnotation["term"];

type TermInputFieldProps = {
  ref: React.Ref<HTMLInputElement>;
  value: Term;
  onChange: (v: Term) => void;
  label?: string;
  isInvalid?: boolean;
  errors?: React.ComponentProps<typeof FieldError>["errors"];
} & Omit<React.ComponentProps<typeof InputGroupInput>, "value" | "onChange">;

const TermInputField: React.FC<TermInputFieldProps> = ({
  ref,
  value,
  onChange,
  label,
  name,
  isInvalid,
  errors,
  ...props
}) => {
  const [loading, setLoading] = useState(false);

  const updateTermById = async (id: Term["id"]) => {
    try {
      if (!/^GO:[0-9]{7}$/.test(id)) {
        onChange({ id, name: "", aspect: "" });
        return;
      }
      setLoading(true);
      const result = await fetchById("GO", id);
      if (!result) {
        onChange({ id, name: "", aspect: "" });
      } else {
        onChange({
          id: result.id,
          name: result.name,
          aspect: shortenGOAspect(result.aspect),
        });
      }
    } catch (e) {
      onChange({ id, name: "", aspect: "" });
    } finally {
      setLoading(false);
    }
  };

  const updateTermByIdDebounced = useDebounceCallback(updateTermById, 500);

  return (
    <FieldGroup>
      <Field data-invalid={isInvalid}>
        {label && <FieldLabel htmlFor={name}>*Lab name:</FieldLabel>}
        <InputGroup>
          <InputGroupInput
            ref={ref}
            defaultValue={value.id.replace(/^GO:/, "")}
            onChange={(e) => updateTermByIdDebounced(`GO:${e.target.value}`)}
            name={name}
            aria-invalid={isInvalid}
            placeholder="0000000"
            autoComplete="off"
            {...props}
          />
          <InputGroupAddon align="inline-start">
            <span className="text-muted-foreground">GO:</span>
          </InputGroupAddon>
        </InputGroup>
        {loading ? (
          <FieldDescription>Verifying...</FieldDescription>
        ) : isInvalid ? (
          <FieldError errors={[errors?.[0]]} />
        ) : (
          value.name && (
            <FieldDescription className="text-sm">
              {value.name}
            </FieldDescription>
          )
        )}
      </Field>
    </FieldGroup>
  );
};

export default TermInputField;
