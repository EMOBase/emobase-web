import React from "react";

import { Icon } from "@/components/ui/icon";
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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useSession } from "@/hooks/session/useSession";
import { useFavoriteGenes } from "@/states/favoriteGenes";

type NavItem = {
  id?:
    | "DASHBOARD"
    | "MY_GENES"
    | "ADMIN"
    | "GENOME_BROWSER"
    | "BLAST"
    | "ID_CONVERTER"
    | "ONTOLOGY_VIEWER";
  label: string;
  icon: string;
  href?: string;
  requiresAuth?: boolean;
  children?: { label: string; href: string }[];
};

const homeItems: NavItem[] = [
  {
    id: "DASHBOARD",
    label: "Home",
    icon: "home",
    href: "/",
  },
  {
    id: "MY_GENES",
    label: "My Genes",
    icon: "star",
  },
  {
    id: "ADMIN",
    label: "Admin Portal",
    icon: "admin_panel_settings",
    href: "/admin",
    requiresAuth: true,
  },
];

const toolItems: NavItem[] = [
  {
    id: "ID_CONVERTER",
    label: "Gene ID Converter",
    icon: "transform",
    href: "/querypipeline",
  },
  {
    id: "ONTOLOGY_VIEWER",
    label: "Ontology Viewer",
    icon: "schema",
    href: "/ontology",
  },
  {
    id: "GENOME_BROWSER",
    label: "Genome Browser",
    icon: "tab_search",
    href: "/genomebrowser",
  },
  {
    id: "BLAST",
    label: "Blast",
    icon: "genetics",
    href: "/blast",
  },
];

export const getActiveView = (url: string): NavItem["id"] | undefined => {
  return homeItems.concat(toolItems).find((item) => item.href === url)?.id;
};

const resourceItems: NavItem[] = [
  { label: "Documentation", icon: "description" },
  { label: "Downloads", icon: "download" },
];

type SidebarProps = {
  url: string;
};

const ThisSidebar: React.FC<SidebarProps> = ({ url }) => {
  const { isLoggedIn } = useSession();
  const activeView = getActiveView(url);

  const { isLoading, getFavoriteGenes } = useFavoriteGenes();
  const favoriteGenes = getFavoriteGenes();

  const homeItemsWithFavorites = homeItems
    .filter((item) => !item.requiresAuth || isLoggedIn)
    .map((item) => {
      if (item.id === "MY_GENES" && favoriteGenes.length > 0) {
        return {
          ...item,
          children: favoriteGenes.map((gene) => ({
            label: gene,
            href: `/details/${gene}`,
          })),
        };
      }
      return item;
    });

  const renderNavs = (navItems: NavItem[]) =>
    navItems.map((item) => {
      const hasChildren = item.children && item.children.length > 0;
      const isActive = item.id && activeView === item.id;
      const hasActiveChild = (item?.children ?? []).some(
        (child) => url === child.href,
      );

      return (
        <Collapsible
          key={`${item.id ?? item.label} ${isLoading}`}
          asChild
          defaultOpen={hasActiveChild}
        >
          <SidebarMenuItem className="group/collapsible">
            <CollapsibleTrigger asChild>
              <SidebarMenuButton
                asChild
                size="free"
                tooltip={item.label}
                isActive={isActive}
              >
                <a href={item.href} className="cursor-pointer">
                  <Icon
                    name={item.icon}
                    fill={isActive}
                    weight={isActive ? 500 : 400}
                    className="text-xl"
                  />
                  <span className="text-sm font-medium">{item.label}</span>
                  {hasChildren && (
                    <Icon
                      name="expand_more"
                      className="text-lg text-neutral-500 ml-auto transition-transform group-data-[state=closed]/collapsible:-rotate-90"
                    />
                  )}
                </a>
              </SidebarMenuButton>
            </CollapsibleTrigger>
            {hasChildren && (
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.children!.map((child) => (
                    <SidebarMenuSubItem key={child.href}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={url === child.href}
                      >
                        <a href={child.href}>
                          <span>{child.label}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            )}
          </SidebarMenuItem>
        </Collapsible>
      );
    });

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
                <p className="text-muted text-xs font-normal">version 0.1</p>
              </div>
            </div>
            <SidebarTrigger className="relative z-1 -right-2 group-data-[collapsible=icon]:right-0" />
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>{renderNavs(homeItemsWithFavorites)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="px-3 text-xs font-bold text-muted uppercase tracking-wider mb-3">
              Tools
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>{renderNavs(toolItems)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="px-3 text-xs font-bold text-muted uppercase tracking-wider mb-3">
              Resources
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>{renderNavs(resourceItems)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
};

export default ThisSidebar;
