import { useState, useMemo, useEffect } from "react";
import Papa from "papaparse";
import { twMerge } from "tailwind-merge";

import { Icon } from "@/components/ui/icon";
import DownloadButton from "@/components/common/DownloadButton";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

interface ResultTableProps {
  result: string | undefined;
}

const getPageData = (data: any[], itemsPerPage: number, page: number) => {
  return data.slice(itemsPerPage * (page - 1), itemsPerPage * page);
};

const ResultTable: React.FC<ResultTableProps> = ({ result }) => {
  const [filter, setFilter] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const parsedResult = useMemo(
    () =>
      result === undefined
        ? undefined
        : Papa.parse<Record<string, string>>(result, {
            header: true,
            skipEmptyLines: true,
          }),
    [result],
  );

  const data = useMemo(
    () =>
      (parsedResult?.data ?? []).filter((rowData) =>
        Object.values(rowData).find((field) =>
          field.toLowerCase().includes(filter.toLowerCase()),
        ),
      ),
    [parsedResult, filter],
  );
  const headers = parsedResult?.meta?.fields ?? [];

  const totalPage = Math.ceil(data.length / itemsPerPage);
  useEffect(() => {
    if (page > totalPage) {
      setPage(1);
    }
  }, [page, totalPage]);

  return (
    <section className="space-y-4 pt-4 dark:border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold dark:text-white">Results</h2>
        <InputGroup className="w-full sm:w-64">
          <InputGroupInput
            placeholder="Filter results..."
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="py-2"
          />
          <InputGroupAddon align="inline-start">
            <Icon name="filter_list" className="text-slate-400 text-base" />
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div className="bg-white dark:bg-sidebar-dark border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                {headers.map((item, idx) => (
                  <th key={idx} className="px-6 py-4">
                    {item.replace("->", "\u2192")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {data.length > 0 ? (
                getPageData(data, itemsPerPage, page).map((rowData, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    {headers.map((item, idx) => (
                      <td
                        key={idx}
                        className={twMerge(
                          "px-6 py-4 text-xs text-slate-700 dark:text-slate-200",
                          idx > 0 ? "font-mono" : "font-semibold",
                        )}
                      >
                        {rowData[item]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-slate-500 italic"
                  >
                    {result === undefined
                      ? "Submit your query to see result"
                      : "No results found for your query or filter."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
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
              {data.length == 0 ? 0 : itemsPerPage * (page - 1) + 1}-
              {Math.min(itemsPerPage * page, data.length)} of {data.length}
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
      </div>

      <div className="flex justify-end pt-4 pb-12">
        <DownloadButton
          variant="primary"
          disabled={result === undefined}
          content={result ?? ""}
          filename="result.xlsx"
          filetype="xlsx"
        />
      </div>
    </section>
  );
};

export default ResultTable;
