import { twMerge } from "tailwind-merge";

import { Icon } from "@/components/ui/icon";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type TableFooterProps = {
  itemsPerPage: number;
  setItemsPerPage: React.Dispatch<React.SetStateAction<number>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPage?: number;
  totalRecord: number;
  className?: string;
};

const TableFooter: React.FC<TableFooterProps> = ({
  itemsPerPage,
  setItemsPerPage,
  page,
  setPage,
  totalPage: totalPageProp,
  totalRecord,
  className,
}) => {
  const totalPage = totalPageProp ?? Math.ceil(totalRecord / itemsPerPage);

  return (
    <div
      className={twMerge(
        "px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4",
        className,
      )}
    >
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span>Items per page:</span>
        <Select
          value={itemsPerPage.toString()}
          onValueChange={(v) => setItemsPerPage(parseInt(v))}
        >
          <SelectTrigger size="sm" className="bg-white text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-6">
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
          {totalRecord == 0 ? 0 : itemsPerPage * (page - 1) + 1}-
          {Math.min(itemsPerPage * page, totalRecord)} of {totalRecord}
        </span>
        <div className="flex items-center text-xs gap-1">
          <button
            className="flex p-1 rounded-sm text-slate-600 enabled:hover:text-slate-900 enabled:hover:bg-slate-200 transition-colors disabled:opacity-50"
            disabled={page === 1}
            onClick={() => setPage(1)}
          >
            <Icon name="first_page" className="text-xl" />
          </button>
          <button
            className="flex p-1 rounded-sm text-slate-600 enabled:hover:text-slate-900 enabled:hover:bg-slate-200 transition-colors disabled:opacity-50"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <Icon name="chevron_left" className="text-xl" />
          </button>
          <button
            className="flex p-1 rounded-sm text-slate-600 enabled:hover:text-slate-900 enabled:hover:bg-slate-200 transition-colors disabled:opacity-50"
            disabled={page === totalPage}
            onClick={() => setPage((p) => p + 1)}
          >
            <Icon name="chevron_right" className="text-xl" />
          </button>
          <button
            className="flex p-1 rounded-md text-slate-600 enabled:hover:text-slate-900 enabled:hover:bg-slate-200 transition-colors disabled:opacity-50"
            disabled={page === totalPage}
            onClick={() => setPage(totalPage)}
          >
            <Icon name="last_page" className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableFooter;
