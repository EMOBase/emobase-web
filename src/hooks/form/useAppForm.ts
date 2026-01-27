import { createFormHook } from "@tanstack/react-form";

import InputField from "@/components/form/InputField";
import InputGroupField from "@/components/form/InputGroupField";
import TextareaField from "@/components/form/TextareaField";

import { fieldContext, formContext } from "./useFormContext";

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    InputField,
    InputGroupField,
    TextareaField,
  },
  formComponents: {},
  fieldContext,
  formContext,
});
