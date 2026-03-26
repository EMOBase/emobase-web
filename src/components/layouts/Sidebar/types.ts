import React from "react";

export type NavItemAction = {
  icon: string;
  tooltip?: string;
  onClick: (e: React.MouseEvent) => void;
};

export type NavItemChild = {
  label: React.ReactNode;
  href: string;
  external?: boolean;
  actions?: NavItemAction[];
};

export type NavItem = {
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
  matchingHref?: string;
  external?: boolean;
  requiresAuth?: boolean;
  children?: NavItemChild[];
  disabled?: boolean;
};

export type SidebarProps = {
  url: string;
  logo?: React.ReactNode;
  title?: React.ReactNode;
  forceCollapsed?: boolean;
};
