"use client";

import { useState, useRef, useCallback } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete";
import { navigate } from "astro:transitions/client";

import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteList,
  AutocompleteItem,
} from "@/components/ui/autocomplete";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";
import useService from "@/hooks/useService";
import geneService from "@/utils/services/geneService";
import { cn } from "@/utils/classname";
import { hasFeature } from "@/utils/features";

import { SearchHelpModal } from "./SearchHelpModal";

export interface SearchInputProps {
  size: "big" | "small";
  placeholder?: string;
  className?: string;
  initialValue?: string;
}

const SearchInput = ({
  size,
  placeholder = "Search for gene IDs or phenotypes...",
  className,
  initialValue = "",
}: SearchInputProps) => {
  const { suggest } = useService(geneService);
  const [searchValue, setSearchValue] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);

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

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchValue.trim()) {
      navigate(`/search/${searchValue.trim()}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchValue(val);
    fetchSuggestions(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const helpButton = hasFeature("searchInstruction") ? (
    <SearchHelpModal>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        title="Search instruction"
        className={cn(
          "text-slate-400 hover:text-slate-600 shrink-0",
          size === "big" ? "size-10" : "size-8",
        )}
      >
        <Icon name="help" className={size === "big" ? "text-2xl" : "text-xl"} />
      </Button>
    </SearchHelpModal>
  ) : (
    <button
      className={cn(
        "pointer-events-none",
        size === "big" ? "size-10" : "size-8",
      )}
    />
  );

  const Container = size === "big" ? ("form" as const) : InputGroup;

  return (
    <Autocomplete
      onValueChange={(val: string | null) => {
        if (val) {
          setSearchValue(val);
        }
      }}
    >
      <div className="contents">
        <Container
          ref={formRef as any}
          onSubmit={size === "big" ? handleSubmit : undefined}
          className={cn(
            "relative transition-all",
            size === "big"
              ? cn("w-full flex items-center", className)
              : className,
          )}
        >
          {/* Prefix: Search Icon */}
          {size === "big" ? (
            <Icon
              name="search"
              className="text-2xl text-slate-400 ml-4 shrink-0"
            />
          ) : (
            <InputGroupAddon>
              <Icon name="search" className="text-lg" />
            </InputGroupAddon>
          )}

          <AutocompletePrimitive.Input
            render={
              size === "big" ? (
                <input
                  name="search"
                  type="text"
                  autoComplete="off"
                  autoCorrect="off"
                  placeholder={placeholder}
                  className="block w-full px-4 py-3 bg-transparent border-none text-slate-800 placeholder-slate-400 focus:ring-0 text-lg outline-none"
                  value={searchValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                />
              ) : (
                <InputGroupInput
                  className="rounded-md w-90 px-3 py-2"
                  placeholder={placeholder}
                  value={searchValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                />
              )
            }
          />

          {/* Suffix: Spinner, Help, and Search Button */}
          {size === "big" ? (
            <div className="flex items-center gap-1 pr-1 shrink-0">
              <div className="flex items-center justify-center size-10 shrink-0">
                {loading ? <Spinner className="size-5" /> : helpButton}
              </div>
              <Button
                type="submit"
                variant="primary"
                className="px-8 font-bold rounded-xl h-12"
              >
                Search
              </Button>
            </div>
          ) : (
            <InputGroupAddon align="inline-end">
              {loading ? (
                <div className="flex items-center justify-center size-8 shrink-0 -mr-[0.45rem]">
                  <Spinner className="size-4" />
                </div>
              ) : (
                helpButton
              )}
            </InputGroupAddon>
          )}
        </Container>

        {suggestions.length > 0 && (
          <AutocompleteContent
            sideOffset={8}
            anchor={formRef}
            container={portalRef?.current}
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
        <div ref={portalRef} />
      </div>
    </Autocomplete>
  );
};

export default SearchInput;
