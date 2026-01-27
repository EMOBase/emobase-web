import { createFormHook } from "@tanstack/react-form";

import InputField from "@/components/form/InputField";
import InputGroupField from "@/components/form/InputGroupField";
import TextareaField from "@/components/form/TextareaField";
import SelectField from "@/components/form/SelectField";

import { fieldContext, formContext } from "./useFormContext";

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    InputField,
    InputGroupField,
    TextareaField,
    SelectField,
  },
  formComponents: {},
  fieldContext,
  formContext,
});
