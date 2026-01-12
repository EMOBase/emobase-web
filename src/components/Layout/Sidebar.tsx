import React from "react";

type ViewType =
  | "DASHBOARD"
  | "GENOME_BROWSER"
  | "PHENOTYPE_SEARCH"
  | "ID_CONVERTER"
  | "ONTOLOGY_VIEWER";

interface SidebarProps {
  activeView: ViewType;
  onNavigate?: (view: ViewType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate }) => {
  const navItems = [
    {
      id: "DASHBOARD" as const,
      label: "Home",
      icon: "home",
    },
    {
      id: "GENOME_BROWSER" as const,
      label: "Genome Browser",
      icon: "travel_explore",
    },
    {
      id: "PHENOTYPE_SEARCH" as const,
      label: "Phenotype Search",
      icon: "search",
    },
    {
      id: "ID_CONVERTER" as const,
      label: "Gene ID Converter",
      icon: "transform",
    },
    {
      id: "ONTOLOGY_VIEWER" as const,
      label: "Ontology Viewer",
      icon: "schema",
    },
  ];

  const resourceItems = [
    { label: "Documentation", icon: "description" },
    { label: "Downloads", icon: "download" },
  ];

  return (
    <aside className="w-72 bg-white border-r border-border-light flex-shrink-0 flex flex-col h-screen z-20 hidden md:flex shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)]">
      <div
        className="p-8 flex items-center gap-3 cursor-pointer"
        onClick={() => onNavigate?.("DASHBOARD")}
      >
        <div className="size-10 rounded-xl mustard-gradient flex items-center justify-center shadow-lg shadow-orange-500/20 text-white">
          <span className="material-symbols-outlined text-2xl">
            pest_control
          </span>
        </div>
        <div className="flex flex-col">
          <h1 className="text-text-main text-xl font-bold leading-tight tracking-tight font-display">
            iBeetle Base
          </h1>
          <p className="text-text-muted text-xs font-normal">version 0.1</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-6 flex flex-col gap-8">
        <div className="flex flex-col gap-1.5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate?.(item.id)}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg w-full text-left transition-all group ${
                activeView === item.id
                  ? "bg-orange-50 text-orange-700 font-medium"
                  : "text-slate-600 hover:text-primary hover:bg-orange-50"
              }`}
            >
              <span
                className={`material-symbols-outlined ${activeView === item.id ? "text-primary" : "group-hover:text-primary"} transition-colors`}
                style={
                  activeView === item.id
                    ? { fontVariationSettings: "'FILL' 1" }
                    : {}
                }
              >
                {item.icon}
              </span>
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-1.5">
          <p className="px-3 text-xs font-bold text-text-muted uppercase tracking-wider mb-3">
            Resources
          </p>
          {resourceItems.map((item) => (
            <a
              key={item.label}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-600 hover:text-primary hover:bg-orange-50 transition-all group"
              href="#"
            >
              <span className="material-symbols-outlined group-hover:text-primary transition-colors">
                {item.icon}
              </span>
              <span className="text-sm font-medium">{item.label}</span>
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
