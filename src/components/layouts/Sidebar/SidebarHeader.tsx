import React from "react";
import { twMerge } from "tailwind-merge";
import {
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import type { SidebarProps } from "./types";

const CustomSidebarHeader: React.FC<SidebarProps> = ({
  logo,
  title,
  forceCollapsed,
}) => {
  const { state } = useSidebar();

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
            <p className="text-muted text-xs font-normal">version 0.1</p>
          </div>
        </div>
        {!forceCollapsed && (
          <SidebarTrigger className="relative z-1 -right-2 group-data-[collapsible=icon]:right-0" />
        )}
      </div>
    </SidebarHeader>
  );
};

export default CustomSidebarHeader;
