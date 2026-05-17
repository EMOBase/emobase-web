import React from "react";
import { Icon } from "@/components/ui/icon";
import {
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
import { isPathActive } from "./constants";
import type { NavItem } from "./types";

type SidebarNavItemProps = {
  item: NavItem;
  url: string;
  activeView?: string;
};

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  item,
  url,
  activeView,
}) => {
  if (item.disabled) return null;

  const { state } = useSidebar();
  const hasChildren = item.children && item.children.length > 0;
  const isActive = item.id && activeView === item.id;
  const hasActiveChild = (item?.children ?? []).some((child) =>
    isPathActive(url, child.href || ""),
  );
  const isCollapsed = state === "collapsed";

  const navButton = (
    <SidebarMenuButton
      asChild
      size="free"
      tooltip={item.label}
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
      <SidebarMenuItem key={`${item.id ?? item.label} ${hasActiveChild}`}>
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
                key={child.href}
                render={
                  <a
                    href={child.href}
                    target={child.external ? "_blank" : "_self"}
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
                      {child.external && (
                        <Icon
                          name="open_in_new"
                          className="text-lg text-neutral-500"
                        />
                      )}
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
      key={`${item.id ?? item.label} ${hasActiveChild}`}
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
                  key={child.href}
                  className="group/subitem relative"
                >
                  <SidebarMenuSubButton
                    asChild
                    isActive={isPathActive(url, child.href || "")}
                  >
                    <a
                      href={child.href}
                      target={child.external ? "_blank" : "_self"}
                      className="pr-6"
                    >
                      <span className="truncate">{child.label}</span>
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
                  {child.external && (
                    <Icon
                      name="open_in_new"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-lg text-neutral-500"
                    />
                  )}
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        )}
      </SidebarMenuItem>
    </Collapsible>
  );
};

export default SidebarNavItem;
