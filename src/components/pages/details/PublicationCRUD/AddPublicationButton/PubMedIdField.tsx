import { useEffect } from "react";
import { useStore } from "@tanstack/react-form";
import { useDebounceValue } from "usehooks-ts";

import { withForm } from "@/hooks/form/useAppForm";

import { fetchPubMedArticle, type PubMedArticle } from "./pubmed";
import formOptions from "./formOptions";

function isValidPMID(input: string) {
  return /^\d{6,9}$/.test(input);
}

const PubMedIdField = withForm({
  ...formOptions,
  render: ({ form }) => {
    const pmid = useStore(form.store, (state) => state.values.pmid);

    const [debouncedPMID] = useDebounceValue(pmid, 500);

    useEffect(() => {
      if (!isValidPMID(pmid)) return;
      fetchPubMedArticle(debouncedPMID)?.then((result) => {
        if (result) {
          const fields = Object.keys(result) as (keyof PubMedArticle)[];
          fields.forEach((field) => {
            form.setFieldValue(field, result[field]);
          });
        }
      });
    }, [debouncedPMID]);

    return (
      <form.AppField
        name="pmid"
        children={(field) => (
          <field.InputGroupField
            label="PubMed ID"
            type="number"
            placeholder="e.g. 18586236"
            leftAddon="PMID:"
            className="[appearance:textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
          />
        )}
      />
    );
  },
});

export default PubMedIdField;
