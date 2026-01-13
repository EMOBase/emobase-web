import React from "react";

import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

type ViewType =
  | "DASHBOARD"
  | "GENOME_BROWSER"
  | "PHENOTYPE_SEARCH"
  | "ID_CONVERTION"
  | "ONTOLOGY_VIEWER";

const navItems = [
  {
    id: "DASHBOARD" as const,
    label: "Home",
    icon: "home",
    href: "/",
  },
  {
    id: "GENOME_BROWSER" as const,
    label: "Genome Browser",
    icon: "travel_explore",
    href: "#",
  },
  {
    id: "PHENOTYPE_SEARCH" as const,
    label: "Phenotype Search",
    icon: "search",
    href: "/search",
  },
  {
    id: "ID_CONVERTION" as const,
    label: "Gene ID Converter",
    icon: "transform",
    href: "/querypipeline",
  },
  {
    id: "ONTOLOGY_VIEWER" as const,
    label: "Ontology Viewer",
    icon: "schema",
    href: "/ontology",
  },
];

export const getActiveView = (url: string): ViewType | undefined => {
  return navItems.find(({ href }) => href === url)?.id;
};

const resourceItems = [
  { label: "Documentation", icon: "description" },
  { label: "Downloads", icon: "download" },
];

type SidebarProps = {
  url: string;
};

const ThisSidebar: React.FC<SidebarProps> = ({ url }) => {
  const activeView = getActiveView(url);

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="relative flex items-center justify-end gap-3">
            <div className="absolute left-0 w-full flex items-center gap-3 group-data-[collapsible=icon]:opacity-0 transition-opacity">
              <a
                className="min-w-10 size-10 rounded-xl mustard-gradient flex items-center justify-center shadow-lg shadow-amber-500/20 text-white cursor-pointer"
                href="/"
              >
                <span className="material-symbols-outlined text-2xl">
                  pest_control
                </span>
              </a>

              <div className="flex-1 flex flex-col">
                <h1 className="text-text-main text-xl font-bold leading-tight tracking-tight font-display text-nowrap">
                  iBeetle Base
                </h1>
                <p className="text-text-muted text-xs font-normal">
                  version 0.1
                </p>
              </div>
            </div>
            <SidebarTrigger className="relative z-1 -right-2 group-data-[collapsible=icon]:right-0" />
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      asChild
                      size="free"
                      tooltip={item.label}
                      isActive={activeView === item.id}
                    >
                      <a href={item.href}>
                        <span
                          className="material-symbols-outlined"
                          style={
                            activeView === item.id
                              ? {
                                  fontVariationSettings: "'FILL' 1, 'wght' 500",
                                }
                              : {}
                          }
                        >
                          {item.icon}
                        </span>
                        <span className="text-sm font-medium">
                          {item.label}
                        </span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="px-3 text-xs font-bold text-text-muted uppercase tracking-wider mb-3">
              Resources
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {resourceItems.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild size="free" tooltip={item.label}>
                      <a href="#">
                        <span className="material-symbols-outlined">
                          {item.icon}
                        </span>
                        <span className="text-sm font-medium">
                          {item.label}
                        </span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
};

export default ThisSidebar;
