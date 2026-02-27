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
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useSession } from "@/hooks/session/useSession";
import { useFavoriteGenes } from "@/states/favoriteGenes";
import { getEnv } from "@/utils/env";

type NavItemAction = {
  icon: string;
  tooltip?: string;
  onClick: (e: React.MouseEvent) => void;
};

type NavItemChild = {
  label: string;
  href: string;
  actions?: NavItemAction[];
};

type NavItem = {
  id?:
    | "DASHBOARD"
    | "MY_GENES"
    | "ADMIN"
    | "GENOME_BROWSER"
    | "BLAST"
    | "ID_CONVERTER"
    | "ONTOLOGY_VIEWER"
    | "RESOURCES";
  label: string;
  icon: string;
  href?: string;
  external?: boolean;
  requiresAuth?: boolean;
  children?: NavItemChild[];
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
  return homeItems
    .concat(toolItems)
    .concat(resourceItems)
    .find((item) => item.href === url)?.id;
};

const resourceItems: NavItem[] = [
  {
    label: "API Docs",
    icon: "api",
    href: getEnv("PUBLIC_UI_PAGE_API_DOC"),
    external: true,
  },

  {
    id: "RESOURCES",
    label: "Other Resources",
    icon: "folder_open",
    href: "/resources",
  },
  { label: "Help", icon: "quiz" },
];

type SidebarProps = {
  url: string;
};

const SidebarInner: React.FC<SidebarProps> = ({ url }) => {
  const { isLoggedIn } = useSession();
  const { state } = useSidebar();
  const activeView = getActiveView(url);

  const { isLoading, getFavoriteGenes, unmarkFavorite } = useFavoriteGenes();
  const favoriteGenes = getFavoriteGenes();

  const homeItemsWithFavorites = homeItems
    .filter((item) => !item.requiresAuth || isLoggedIn)
    .map((item): NavItem => {
      if (item.id === "MY_GENES" && favoriteGenes.length > 0) {
        return {
          ...item,
          children: favoriteGenes.map(
            (gene): NavItemChild => ({
              label: gene,
              href: `/details/${gene}`,
              actions: [
                {
                  icon: "close",
                  tooltip: "Remove from My Genes",
                  onClick: (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    unmarkFavorite(gene);
                  },
                },
              ],
            }),
          ),
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

      const isCollapsed = state === "collapsed";

      const navButton = (
        <SidebarMenuButton
          asChild
          size="free"
          tooltip={isCollapsed ? undefined : item.label}
          isActive={isActive}
        >
          <a
            href={item.href}
            target={item.external ? "_blank" : "_self"}
            className="flex items-center cursor-pointer"
          >
            <Icon
              name={item.icon}
              fill={isActive}
              weight={isActive ? 500 : 400}
              className="text-xl"
            />
            <span className="text-sm font-medium flex-1 truncate">
              {item.label}
            </span>
            {!isCollapsed && hasChildren && (
              <Icon
                name="expand_more"
                className="text-lg text-neutral-500 transition-transform group-data-[state=closed]/collapsible:-rotate-90"
              />
            )}
            {item.external && (
              <Icon name="open_in_new" className="text-lg text-neutral-500" />
            )}
          </a>
        </SidebarMenuButton>
      );

      if (isCollapsed && hasChildren) {
        return (
          <SidebarMenuItem key={`${item.id ?? item.label} ${isLoading}`}>
            <DropdownMenu>
              <DropdownMenuTrigger render={navButton} />
              <DropdownMenuContent
                side="right"
                align="start"
                sideOffset={12}
                className="w-48"
              >
                <div className="px-2 py-1.5 text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  {item.label}
                </div>
                {item.children!.map((child) => (
                  <DropdownMenuItem
                    key={child.label}
                    render={
                      <a
                        href={child.href}
                        className="flex items-center justify-between w-full"
                      >
                        <span className="truncate">{child.label}</span>
                        <div className="flex items-center gap-1">
                          {(child.actions ?? []).map((action, i) => (
                            <button
                              key={i}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                action.onClick(e);
                              }}
                              className="p-1 rounded-md transition-all size-6 flex items-center justify-center text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100"
                              title={action.tooltip}
                            >
                              <Icon name={action.icon} className="text-sm" />
                            </button>
                          ))}
                        </div>
                      </a>
                    }
                    className="focus:bg-neutral-50/80"
                  />
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        );
      }

      return (
        <Collapsible
          key={`${item.id ?? item.label} ${isLoading}`}
          asChild
          defaultOpen={hasActiveChild}
        >
          <SidebarMenuItem className="group/collapsible">
            <CollapsibleTrigger asChild>{navButton}</CollapsibleTrigger>
            {hasChildren && (
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.children!.map((child) => (
                    <SidebarMenuSubItem
                      key={child.label}
                      className="group/subitem relative"
                    >
                      <SidebarMenuSubButton
                        asChild
                        isActive={url === child.href}
                      >
                        <a href={child.href}>
                          <span className="truncate pr-6">{child.label}</span>
                        </a>
                      </SidebarMenuSubButton>
                      <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        {(child.actions ?? []).map((action, i) => (
                          <button
                            key={i}
                            onClick={action.onClick}
                            className="opacity-0 group-hover/subitem:opacity-100 hover:bg-neutral-100 p-1 rounded-md transition-all size-6 flex items-center justify-center text-neutral-400 hover:text-neutral-600"
                            title={action.tooltip}
                          >
                            <Icon name={action.icon} className="text-sm" />
                          </button>
                        ))}
                      </div>
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
  );
};

const ThisSidebar: React.FC<SidebarProps> = ({ url }) => {
  return (
    <SidebarProvider>
      <SidebarInner url={url} />
    </SidebarProvider>
  );
};

export default ThisSidebar;
