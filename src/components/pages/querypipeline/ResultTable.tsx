import { useState, useMemo, useEffect } from "react";
import Papa from "papaparse";
import { twMerge } from "tailwind-merge";

import { Icon } from "@/components/ui/icon";
import DownloadButton from "@/components/common/DownloadButton";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import TableFooter from "@/components/common/TableFooter";

interface ResultTableProps {
  result: string | undefined;
  error: string | undefined;
}

const getPageData = (data: any[], itemsPerPage: number, page: number) => {
  return data.slice(itemsPerPage * (page - 1), itemsPerPage * page);
};

const ResultTable: React.FC<ResultTableProps> = ({ result, error }) => {
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
                {headers.length === 0 && <th className="px-6 py-4"> </th>}
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
                    {error
                      ? error
                      : result === undefined
                        ? "Submit your query pipeline to see result"
                        : "No results found for your query or filter."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <TableFooter
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          page={page}
          setPage={setPage}
          totalPage={totalPage}
          totalRecord={data.length}
        />
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
