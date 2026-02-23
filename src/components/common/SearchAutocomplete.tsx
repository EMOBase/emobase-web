"use client";

import { useState, useRef, useCallback } from "react";
import { useDebounceCallback } from "usehooks-ts";
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteList,
  AutocompleteItem,
  AutocompleteEmpty,
} from "@/components/ui/autocomplete";
import useService from "@/hooks/useService";
import geneService from "@/utils/services/geneService";
import { cn } from "@/utils/classname";

export interface SearchAutocompleteProps {
  placeholder?: string;
  className?: string;
  anchor?: React.RefObject<HTMLDivElement | HTMLFormElement | null>;
  container?: React.RefObject<HTMLElement | null>;
  renderInput: (props: {
    searchValue: string;
    setSearchValue: (val: string) => void;
    loading: boolean;
    fetchSuggestions: (term: string) => void;
  }) => React.ReactNode;
}

const SearchAutocomplete = ({
  className,
  anchor,
  container,
  renderInput,
}: SearchAutocompleteProps) => {
  const { suggest } = useService(geneService);
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const suggestRef = useRef(suggest);
  suggestRef.current = suggest;

  const fetchSuggestions = useDebounceCallback(
    useCallback(async (query: string) => {
      const trimmed = query.trim();
      if (!trimmed) {
        setSuggestions([]);
        return;
      }
      setLoading(true);
      try {
        const results = await suggestRef.current(trimmed);
        setSuggestions(results || []);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
      } finally {
        setLoading(false);
      }
    }, []),
    300,
  );

  return (
    <Autocomplete
      onValueChange={(val: string | null) => {
        if (val) {
          setSearchValue(val);
        }
      }}
    >
      <div className={cn("contents", className)}>
        {renderInput({
          searchValue,
          setSearchValue,
          loading,
          fetchSuggestions,
        })}

        {suggestions.length > 0 && (
          <AutocompleteContent
            sideOffset={8}
            anchor={anchor}
            container={container?.current}
            className="w-full min-w-(--anchor-width)"
          >
            <AutocompleteList>
              {suggestions.map((suggestion) => (
                <AutocompleteItem key={suggestion} value={suggestion}>
                  {suggestion}
                </AutocompleteItem>
              ))}
            </AutocompleteList>
          </AutocompleteContent>
        )}
      </div>
    </Autocomplete>
  );
};

export default SearchAutocomplete;
