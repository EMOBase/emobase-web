import { cn } from "@/utils/classname";

type TableOfContentsProps = {
  items: {
    title: string;
    id: string;
  }[];
};

const TableOfContents: React.FC<TableOfContentsProps> = ({ items }) => {
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
              const isActive = id === "overview";

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
