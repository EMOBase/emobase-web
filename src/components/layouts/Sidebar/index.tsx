import React, { useState } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
} from "@/components/ui/sidebar";
import SidebarHeader from "./SidebarHeader";
import SidebarNavItem from "./SidebarNavItem";
import { useSidebarSections } from "./useSidebarSections";
import type { SidebarProps } from "./types";

const SidebarInner: React.FC<SidebarProps> = (props) => {
  const { url } = props;
  const { homeItems, toolItems, resourceItems, activeView, isLoading } =
    useSidebarSections(url);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader {...props} />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {homeItems.map((item) => (
                <SidebarNavItem
                  key={item.id ?? item.label}
                  item={item}
                  url={url}
                  activeView={activeView}
                  isLoading={isLoading}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-xs font-bold text-muted uppercase tracking-wider mb-3">
            Tools
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolItems.map((item) => (
                <SidebarNavItem
                  key={item.id ?? item.label}
                  item={item}
                  url={url}
                  activeView={activeView}
                  isLoading={isLoading}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-xs font-bold text-muted uppercase tracking-wider mb-3">
            Resources
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {resourceItems.map((item) => (
                <SidebarNavItem
                  key={item.id ?? item.label}
                  item={item}
                  url={url}
                  activeView={activeView}
                  isLoading={isLoading}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

const ThisSidebar: React.FC<SidebarProps> = (props) => {
  const [open, setOpen] = useState(true);

  return (
    <SidebarProvider
      open={props.forceCollapsed ? false : open}
      onOpenChange={setOpen}
    >
      <SidebarInner {...props} />
    </SidebarProvider>
  );
};

export default ThisSidebar;
