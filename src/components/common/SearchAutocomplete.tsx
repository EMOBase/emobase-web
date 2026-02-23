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
    open: boolean;
    setOpen: (open: boolean) => void;
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
  const [open, setOpen] = useState(false);

  const suggestRef = useRef(suggest);
  suggestRef.current = suggest;

  const fetchSuggestions = useDebounceCallback(
    useCallback(async (query: string) => {
      const trimmed = query.trim();
      if (!trimmed) {
        setSuggestions([]);
        setOpen(false);
        return;
      }
      setLoading(true);
      try {
        const results = await suggestRef.current(trimmed);
        setSuggestions(results || []);
        setOpen((results || []).length > 0);
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
      open={open}
      onOpenChange={setOpen}
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
          open,
          setOpen,
        })}

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
            {!loading && suggestions.length === 0 && searchValue.trim() && (
              <AutocompleteEmpty>No results found</AutocompleteEmpty>
            )}
          </AutocompleteList>
        </AutocompleteContent>
      </div>
    </Autocomplete>
  );
};

export default SearchAutocomplete;
