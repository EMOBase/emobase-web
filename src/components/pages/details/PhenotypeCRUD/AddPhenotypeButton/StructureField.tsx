import { useStore } from "@tanstack/react-form";
import { useEffect, useRef, useState, useTransition } from "react";
import { useDebounceValue } from "usehooks-ts";

import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  useAutocompleteAnchor,
} from "@/components/ui/autocomplete";
import {
  Field,
  FieldError,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { withForm } from "@/hooks/form/useAppForm";
import { search } from "@/utils/services/ontologyService";
import type { PhenotypeInput } from "@/utils/constants/phenotype";

import formOptions from "./formOptions";

type Term = PhenotypeInput["structure"];

const StructureField = withForm({
  ...formOptions,
  render: ({ form }) => {
    const [searchResults, setSearchResults] = useState<Term[]>([]);
    const [isPending, startTransition] = useTransition();

    const abortControllerRef = useRef<AbortController | null>(null);
    const inputGroupRef = useAutocompleteAnchor();

    const termNameValue = useStore(
      form.store,
      (state) => state.values.structure.termName,
    );
    const [debouncedTermName] = useDebounceValue(termNameValue, 500);

    useEffect(() => {
      if (debouncedTermName === "") {
        setSearchResults([]);
        return;
      }

      const controller = new AbortController();
      abortControllerRef.current?.abort();
      abortControllerRef.current = controller;

      startTransition(async () => {
        const result = await search("TrOn", debouncedTermName, [
          "mixed",
          "concrete",
        ]);

        if (controller.signal.aborted) {
          return;
        }

        startTransition(() => {
          setSearchResults(
            result.data.map((t) => ({
              termId: t.id,
              termName: t.name,
            })),
          );
        });
      });

      return () => {
        controller.abort();
      };
    }, [debouncedTermName]);

    return (
      <FieldGroup>
        <form.AppField
          name="structure"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Affected structure</FieldLabel>
                <Autocomplete
                  items={searchResults}
                  value={field.state.value.termName}
                  onValueChange={(v) => {
                    const term = searchResults.find(
                      (item) => item.termName === v,
                    );
                    if (term) field.handleChange(term);
                    else field.handleChange({ termId: "", termName: v });
                  }}
                  itemToStringValue={(item) => item.termName}
                  filter={null}
                >
                  <AutocompleteInput
                    ref={inputGroupRef}
                    id={field.name}
                    name={field.name}
                    placeholder="e.g. head"
                    loading={isPending}
                    aria-invalid={isInvalid}
                  />

                  {searchResults.length > 0 && (
                    <AutocompleteContent
                      anchor={inputGroupRef}
                      sideOffset={8}
                      align="start"
                    >
                      <AutocompleteList>
                        {(item: Term) => (
                          <AutocompleteItem key={item.termId} value={item}>
                            {item.termName}
                          </AutocompleteItem>
                        )}
                      </AutocompleteList>
                    </AutocompleteContent>
                  )}
                </Autocomplete>
                {field.state.value.termId && (
                  <FieldDescription>
                    {field.state.value.termId}
                  </FieldDescription>
                )}
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
      </FieldGroup>
    );
  },
});

export default StructureField;
