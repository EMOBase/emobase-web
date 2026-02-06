import { useState, useEffect } from "react";
import { useDebounceCallback } from "usehooks-ts";

import { cn } from "@/utils/classname";

type TableOfContentsProps = {
  items: {
    title: string;
    id: string;
  }[];
};

const TableOfContents: React.FC<TableOfContentsProps> = ({ items }) => {
  const [activeId, setActiveId] = useState(items[0].id);

  const dbSetActiveId = useDebounceCallback(setActiveId, 50);

  useEffect(() => {
    const intersectionRatios = Object.fromEntries(
      items.map(({ id }) => [id, 0]),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          intersectionRatios[entry.target.id] = entry.intersectionRatio;
        });

        const mostVisibleSection = items.reduce(
          (best, current) => {
            if (!best) return current;

            if (intersectionRatios[current.id] > intersectionRatios[best.id])
              return current;

            return best;
          },
          null as (typeof items)[number] | null,
        );

        if (mostVisibleSection) {
          dbSetActiveId(mostVisibleSection.id);
        }
      },
      {
        rootMargin: "0px 0px -50% 0px",
        threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
      },
    );

    items.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
  }, []);

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 hidden lg:block">
      <div className="sticky top-0 flex flex-col gap-6">
        <div className="bg-white rounded-xl shadow-sticky border border-slate-200 p-1">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 rounded-t-lg">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">
              Contents
            </h3>
          </div>
          <nav className="flex flex-col p-2 space-y-1">
            {items.map(({ id, title }) => {
              const isActive = id === activeId;

              return (
                <a
                  key={id}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg group transition-colors",
                    isActive && "text-slate-900 bg-orange-50",
                  )}
                  href={`#${id}`}
                >
                  <span>{title}</span>
                  {isActive && (
                    <span className="size-1.5 rounded-full bg-primary"></span>
                  )}
                </a>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default TableOfContents;
