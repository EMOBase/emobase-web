import React, { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import {
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SidebarProps } from "./types";
import genomicsService, { type VersionItem } from "@/utils/services/genomics";
import { useVersionStore } from "@/states/versionStore";

const CustomSidebarHeader: React.FC<SidebarProps> = ({
  logo,
  title,
  forceCollapsed,
}) => {
  const { state } = useSidebar();
  const [readyVersions, setReadyVersions] = useState<VersionItem[]>([]);
  const [versionsLoading, setVersionsLoading] = useState(true);
  const { selectedVersion, setSelectedVersion } = useVersionStore();

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const { fetchReadyVersions } = genomicsService();
        const versions = await fetchReadyVersions();
        if (cancelled) return;
        setReadyVersions(versions);
        if (!selectedVersion && versions.length > 0) {
          const defaultVer = versions.find((v) => v.isDefault) ?? versions[0];
          setSelectedVersion(defaultVer.name);
        }
      } catch {
        if (!cancelled) setReadyVersions([]);
      } finally {
        if (!cancelled) setVersionsLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <SidebarHeader>
      <div className="relative flex items-center justify-end gap-3 min-h-11">
        <div
          className={twMerge(
            "absolute left-0 w-full flex items-center gap-3 transition-opacity duration-200",
            state === "collapsed" && !forceCollapsed
              ? "opacity-0 invisible"
              : "opacity-100 visible",
          )}
        >
          <a
            href="/"
            className={twMerge(
              "cursor-pointer",
              (forceCollapsed || state === "collapsed") &&
                "[&_#logo]:size-8 [&_#logo]:rounded-lg",
            )}
          >
            {logo}
          </a>
          <div
            className={twMerge(
              "flex-1 flex flex-col transition-all duration-200",
              forceCollapsed
                ? "w-0 overflow-hidden opacity-0 invisible"
                : "w-auto opacity-100 visible",
            )}
          >
            <h1 className="text-text-main text-xl font-bold leading-tight tracking-tight font-display text-nowrap">
              {title}
            </h1>
            <div className="flex items-center gap-1 min-h-[1.25rem]">
              {versionsLoading ? (
                <span className="text-muted text-xs font-normal">Loading...</span>
              ) : readyVersions.length > 0 ? (
                <Select
                  value={selectedVersion ?? undefined}
                  onValueChange={setSelectedVersion}
                >
                  <SelectTrigger
                    size="sm"
                    className="h-auto border-none bg-transparent px-0 py-0 text-muted text-xs font-normal shadow-none hover:text-foreground transition-colors [&_svg]:hidden"
                  >
                    <SelectValue placeholder="Select version" />
                  </SelectTrigger>
                  <SelectContent align="start" sideOffset={4}>
                    {readyVersions.map((v) => (
                      <SelectItem key={v.id} value={v.name} className="text-xs">
                        {v.name}
                        {v.isDefault ? " (default)" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <span className="text-muted text-xs font-normal">No versions</span>
              )}
            </div>
          </div>
        </div>
        {!forceCollapsed && (
          <SidebarTrigger className="relative z-1 -right-2 group-data-[collapsible=icon]:right-0 group-data-[collapsible=icon]:left-[3px]" />
        )}
      </div>
    </SidebarHeader>
  );
};

export default CustomSidebarHeader;
