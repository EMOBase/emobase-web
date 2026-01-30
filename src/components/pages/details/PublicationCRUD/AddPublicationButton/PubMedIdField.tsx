import { useState, useEffect } from "react";
import { useStore } from "@tanstack/react-form";
import { useDebounceValue } from "usehooks-ts";

import { Spinner } from "@/components/ui/spinner";
import {
  fetchPubMedArticle,
  fetchPubMedCitation,
  type PubMedArticle,
} from "@/utils/pubmed";
import { withForm } from "@/hooks/form/useAppForm";

import formOptions from "./formOptions";

function isValidPMID(input: string) {
  return /^\d{6,9}$/.test(input);
}

const PubMedIdField = withForm({
  ...formOptions,
  render: ({ form }) => {
    const [loading, setLoading] = useState(false);

    const pmid = useStore(form.store, (state) => state.values.pmid);

    const [debouncedPMID] = useDebounceValue(pmid, 500);

    useEffect(() => {
      if (!isValidPMID(debouncedPMID)) return;
      setLoading(true);
      Promise.all([
        fetchPubMedArticle(debouncedPMID),
        fetchPubMedCitation(debouncedPMID),
      ]).then((result) => {
        const [article, citation] = result;
        if (article) {
          const fields = Object.keys(article) as (keyof PubMedArticle)[];
          fields.forEach((field) => {
            form.setFieldValue(field, article[field]);
          });
          form.setFieldValue("reference", citation?.nlm?.format ?? "");
          setLoading(false);
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
            rightAddon={loading && <Spinner />}
            className="[appearance:textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
          />
        )}
      />
    );
  },
});

export default PubMedIdField;
