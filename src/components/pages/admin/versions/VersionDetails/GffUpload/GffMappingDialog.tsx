import React, { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@/components/ui/icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { GffParseResult } from "./parseGffFile";

export type GffMappingConfirmData = {
  geneIDKey: string;
  trimPrefixChars: number;
  trimSuffixChars: number;
  oldGeneIDKeys: string[];
};

type GffMappingDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  isParsing: boolean;
  attributes: GffParseResult["attributes"];
  subAttributesMap: GffParseResult["subAttributesMap"];
  onConfirm: (data: GffMappingConfirmData) => void;
};

export const GffMappingDialog: React.FC<GffMappingDialogProps> = ({
  isOpen,
  onClose,
  isParsing,
  attributes,
  subAttributesMap,
  onConfirm,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [primaryKey, setPrimaryKey] = useState("");
  const [subKey, setSubKey] = useState("");
  const [trimStart, setTrimStart] = useState("0");
  const [trimEnd, setTrimEnd] = useState("0");
  const [oldGeneIDKeys, setOldGeneIDKeys] = useState<string[]>([]);

  const attributeKeys = useMemo(() => Object.keys(attributes), [attributes]);

  const oldGeneIDAttributeOptions = useMemo(
    () => attributeKeys.filter((key) => key !== primaryKey),
    [attributeKeys, primaryKey],
  );

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setPrimaryKey("");
      setSubKey("");
      setTrimStart("0");
      setTrimEnd("0");
      setOldGeneIDKeys([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (attributeKeys.length === 0) return;

    const defaultPrimary =
      attributeKeys.find((k) => k.toLowerCase() === "dbxref") ||
      attributeKeys[0];
    setPrimaryKey(defaultPrimary);

    const subs = subAttributesMap[defaultPrimary] || [];
    setSubKey(subs.length > 0 ? subs[0] : "");
  }, [attributeKeys, subAttributesMap]);

  useEffect(() => {
    setOldGeneIDKeys((prev) =>
      prev.filter(
        (k) => k !== primaryKey && oldGeneIDAttributeOptions.includes(k),
      ),
    );
  }, [primaryKey, oldGeneIDAttributeOptions]);

  const handlePrimaryKeyChange = (key: string) => {
    setPrimaryKey(key);
    const subs = subAttributesMap[key] || [];
    setSubKey(subs.length > 0 ? subs[0] : "");
  };

  const preview = useMemo(() => {
    if (!primaryKey || Object.keys(attributes).length === 0) {
      return { original: '""', result: "" };
    }

    const values = attributes[primaryKey] || [];
    if (values.length === 0) {
      return { original: `"${primaryKey}="`, result: "" };
    }

    let originalStr = `${primaryKey}=${values.join(",")}`;
    let extractedVal = values[0];

    if (subKey && subAttributesMap[primaryKey]?.includes(subKey)) {
      for (const val of values) {
        if (val.startsWith(`${subKey}:`)) {
          extractedVal = val.substring(subKey.length + 1);
          originalStr = `${primaryKey}=${val}`;
          break;
        }
      }
    }

    let trimmedResult = extractedVal;
    const start = Math.max(0, parseInt(trimStart) || 0);
    const end = Math.max(0, parseInt(trimEnd) || 0);

    if (start + end >= trimmedResult.length) {
      trimmedResult = "";
    } else {
      trimmedResult = trimmedResult.substring(
        start,
        trimmedResult.length - end,
      );
    }

    return {
      original: `"${originalStr}"`,
      result: trimmedResult,
    };
  }, [attributes, primaryKey, subKey, subAttributesMap, trimStart, trimEnd]);

  const getOldGeneIDOptionsForRow = (index: number) => {
    const current = oldGeneIDKeys[index];
    const selectedElsewhere = new Set(
      oldGeneIDKeys.filter((_, i) => i !== index),
    );
    const options = oldGeneIDAttributeOptions.filter(
      (key) => !selectedElsewhere.has(key),
    );
    if (current && !options.includes(current)) {
      return [current, ...options];
    }
    return options;
  };

  const availableOldGeneIDKeys = oldGeneIDAttributeOptions.filter(
    (key) => !oldGeneIDKeys.includes(key),
  );

  const handleAddOldGeneIDKey = () => {
    const nextKey = availableOldGeneIDKeys[0];
    if (!nextKey) return;
    setOldGeneIDKeys((prev) => [...prev, nextKey]);
  };

  const handleRemoveOldGeneIDKey = (index: number) => {
    setOldGeneIDKeys((prev) => prev.filter((_, i) => i !== index));
  };

  const handleOldGeneIDKeyChange = (index: number, key: string) => {
    setOldGeneIDKeys((prev) => {
      const next = [...prev];
      next[index] = key;
      return next;
    });
  };

  const handleConfirm = () => {
    if (!primaryKey) {
      toast.error("Please select a primary attribute key.");
      return;
    }

    const finalGeneIDKey = subKey ? `${primaryKey}.${subKey}` : primaryKey;
    const finalOldKeys = oldGeneIDKeys.filter((k) => k !== "");

    onConfirm({
      geneIDKey: finalGeneIDKey,
      trimPrefixChars: parseInt(trimStart) || 0,
      trimSuffixChars: parseInt(trimEnd) || 0,
      oldGeneIDKeys: finalOldKeys,
    });
  };

  const hasAttributes = Object.keys(attributes).length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="p-8" closeButtonClassName="top-6 right-6">
        <DialogHeader className="p-0 border-none space-y-3">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded bg-blue-50 text-blue-600 text-[10px] font-bold tracking-wider uppercase">
              Step {step} of 2
            </span>
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
              GFF ID Field Mapping
            </span>
          </div>

          <DialogTitle className="text-2xl font-bold text-slate-900 font-display">
            {step === 1 ? "Primary Gene ID Selection" : "Old Gene ID Mapping"}
          </DialogTitle>

          <DialogDescription className="text-slate-500 text-sm leading-relaxed mt-0">
            {step === 1
              ? "Define the unique identifier for your genomic entities by mapping specific attributes from your GFF source file."
              : "Map GFF attributes that contain legacy or alternate gene IDs. These values are indexed so researchers can find genes using identifiers from older nomenclature versions."}
          </DialogDescription>
        </DialogHeader>

        {isParsing && (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-500 text-sm font-medium">
              Scanning GFF file for gene attributes...
            </p>
          </div>
        )}

        {!isParsing && hasAttributes && (
          <div className="mt-6 space-y-6">
            {step === 1 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-2xl">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Primary Attribute Key
                    </label>
                    <Select
                      value={primaryKey}
                      onValueChange={handlePrimaryKeyChange}
                    >
                      <SelectTrigger className="w-full bg-white text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(attributes).map((key) => (
                          <SelectItem key={key} value={key}>
                            {key}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Select Sub-attribute
                    </label>
                    <Select
                      value={subKey}
                      onValueChange={setSubKey}
                      disabled={
                        !subAttributesMap[primaryKey] ||
                        subAttributesMap[primaryKey].length === 0
                      }
                    >
                      <SelectTrigger className="w-full bg-white text-sm">
                        <SelectValue placeholder="No sub-attributes available" />
                      </SelectTrigger>
                      <SelectContent>
                        {(subAttributesMap[primaryKey] || []).map((sub) => (
                          <SelectItem key={sub} value={sub}>
                            {sub}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                    <Icon name="content_cut" className="text-lg text-primary" />
                    <span>Value Trimming</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-slate-500 font-medium">
                        Trim from Start (Chars)
                      </label>
                      <Input
                        type="number"
                        min="0"
                        value={trimStart}
                        onChange={(e) => setTrimStart(e.target.value)}
                        className="bg-white py-2 px-3 text-sm h-10"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-slate-500 font-medium">
                        Trim from End (Chars)
                      </label>
                      <Input
                        type="number"
                        min="0"
                        value={trimEnd}
                        onChange={(e) => setTrimEnd(e.target.value)}
                        className="bg-white py-2 px-3 text-sm h-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 border-l-4 border-primary rounded-r-md p-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">
                      Extraction Preview
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
                      Live Parser
                    </span>
                  </div>

                  <div className="mt-2 w-full">
                    <div className="flex gap-3 mb-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex-1 min-w-0">
                        Original String
                      </span>
                      <span className="w-5 shrink-0" aria-hidden />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex-1 min-w-0">
                        Parsed Result
                      </span>
                    </div>
                    <div className="flex flex-nowrap items-center gap-3">
                      <code className="text-[11px] bg-slate-100/80 text-slate-600 px-3 py-2 rounded-sm font-mono block break-all leading-normal border border-slate-200/50 flex-1 min-w-0">
                        {preview.original}
                      </code>
                      <Icon
                        name="arrow_forward"
                        className="text-lg text-primary/80 shrink-0"
                      />
                      <div className="bg-white border border-slate-200/60 rounded-sm px-4 py-2 font-mono text-xs font-semibold text-slate-800 leading-normal break-all flex-1 min-w-0">
                        {preview.result || (
                          <span className="text-slate-300 font-normal italic">
                            empty
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Old Gene ID Attribute Key
                  </label>
                  {oldGeneIDAttributeOptions.length === 0 ? (
                    <p className="text-sm text-slate-500">
                      No additional attribute keys are available in this GFF
                      file.
                    </p>
                  ) : (
                    <>
                      {oldGeneIDKeys.map((key, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <Select
                            value={key}
                            onValueChange={(val) =>
                              handleOldGeneIDKeyChange(idx, val)
                            }
                          >
                            <SelectTrigger className="flex-1 w-full bg-white text-sm">
                              <SelectValue placeholder="Select attribute key" />
                            </SelectTrigger>
                            <SelectContent>
                              {getOldGeneIDOptionsForRow(idx).map((attrKey) => (
                                <SelectItem key={attrKey} value={attrKey}>
                                  {attrKey}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveOldGeneIDKey(idx)}
                            className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg shrink-0 border-none shadow-none"
                          >
                            <Icon name="delete" className="text-xl" />
                          </Button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={handleAddOldGeneIDKey}
                        disabled={availableOldGeneIDKeys.length === 0}
                        className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-primary-bold transition-colors mt-2 disabled:opacity-40 disabled:pointer-events-none"
                      >
                        <Icon name="add" className="text-base" />
                        {oldGeneIDKeys.length === 0
                          ? "Add gene ID field"
                          : "Add another old gene ID field"}
                      </button>
                    </>
                  )}
                </div>

                <div className="flex gap-3 bg-blue-50/30 border-l-4 border-blue-500 rounded-r-md p-4">
                  <Icon
                    name="info"
                    className="text-xl text-blue-500 shrink-0 mt-0.5"
                  />
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Old gene IDs are indexed in{" "}
                    <strong className="text-slate-900 font-bold">
                      Elasticsearch
                    </strong>{" "}
                    so users can find genes when searching with legacy
                    identifiers. Select attribute keys from your parsed GFF
                    file.
                  </p>
                </div>
              </>
            )}

            <div className="flex justify-between items-center pt-6 border-t border-slate-100 mt-8">
              {step === 1 ? (
                <>
                  <Button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!preview.result}
                    variant="primary"
                    className="font-bold text-xs px-4 py-2.5 gap-2"
                  >
                    Old Gene ID Mapping
                    <Icon name="arrow_forward" className="text-base" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-5 py-2.5 text-xs"
                  >
                    <Icon name="arrow_back" className="text-base" />
                    Back
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleConfirm}
                    className="font-bold text-xs px-4 py-2.5 gap-2"
                  >
                    Confirm Mapping
                    <Icon name="arrow_forward" className="text-base" />
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
