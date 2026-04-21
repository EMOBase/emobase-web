import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import { parseISO, format } from "date-fns";

import { formatBytes } from "@/utils/format";
import genomicsService, { type VersionItem } from "@/utils/services/genomics";
import useAsyncData from "@/hooks/useAsyncData";
import { Icon } from "@/components/ui/icon";
import TableFooter from "@/components/common/TableFooter";
import BeetleLoading from "@/components/common/BeetleLoading";

import CreateVersionButton from "./CreateVersionButton";

const { fetchVersions } = genomicsService();

const StatusBadge = ({ status }: { status: VersionItem["status"] }) => {
  const styles = {
    PROCESSING: "bg-amber-50 text-amber-600 border-amber-200/50",
    READY: "bg-emerald-50 text-emerald-600 border-emerald-200/50",
    DRAFT: "bg-slate-100 text-slate-500 border-slate-200/50",
    ERROR: "bg-red-50 text-red-600 border-red-200/50",
  };

  return (
    <div className="flex items-center gap-2">
      <span
        className={twMerge(
          "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
          styles[status],
        )}
      >
        {status}
      </span>
    </div>
  );
};

const VersionsManager: React.FC = () => {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const { data, loading } = useAsyncData(
    () =>
      fetchVersions({
        pageSize: itemsPerPage,
        page,
      }),
    [itemsPerPage, page],
  );

  const versions = data?.data.versions ?? [];

  return (
    <div className="max-w-6xl space-y-8 animate-in fade-in duration-700 mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-display tracking-tight">
            Data Management
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Upload and publish genomic data
          </p>
        </div>
        <CreateVersionButton />
      </div>

      <div className="bg-white rounded-2xl shadow-card border overflow-hidden">
        <div className="p-8 flex items-center justify-between border-b border-slate-50">
          <div className="flex items-center gap-4">
            <Icon
              name="history"
              weight={500}
              className="text-primary text-2xl"
            />
            <h2 className="text-xl font-bold text-slate-800 font-display">
              Version History
            </h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-50">
                <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">
                  Version Name
                </th>
                <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">
                  Status
                </th>
                <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">
                  Created Date
                </th>
                <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">
                  Total Size
                </th>
                <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50/50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="relative h-48">
                    <BeetleLoading title="Getting Data" />
                  </td>
                </tr>
              ) : versions.length > 0 ? (
                versions.map((version) => (
                  <tr
                    key={version.id}
                    className="group hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-8 py-6 relative">
                      <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex items-center gap-3">
                        <a
                          href={`/admin/versions/${version.name}`}
                          className="font-bold text-slate-700 tracking-tight hover:text-primary transition-colors cursor-pointer"
                        >
                          {version.name}
                        </a>
                        {version.isDefault && (
                          <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-primary-light/20 text-primary-bold">
                            CURRENT
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <StatusBadge status={version.status} />
                    </td>
                    <td className="px-8 py-6 text-slate-500 font-medium text-sm">
                      {format(parseISO(version.createdAt), "P")}
                    </td>
                    <td className="px-8 py-6 text-slate-500 font-bold text-sm">
                      {formatBytes(version.totalFileSize)}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {version.status === "DRAFT" ? null : version.status ===
                          "PROCESSING" ? (
                          <button className="p-2 text-slate-300 hover:text-rose-500 rounded-lg transition-colors">
                            <Icon name="close" className="text-xl" />
                          </button>
                        ) : (
                          <>
                            {version.isDefault && (
                              <button className="p-2 text-slate-300 hover:text-primary rounded-lg transition-colors">
                                <Icon name="edit" className="text-xl" />
                              </button>
                            )}
                            <button className="p-2 text-slate-300 hover:text-primary rounded-lg transition-colors">
                              <Icon name="download" className="text-xl" />
                            </button>
                            {!version.isDefault && (
                              <button className="p-2 text-slate-300 hover:text-rose-500 rounded-lg transition-colors">
                                <Icon name="delete" className="text-xl" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-8 py-12 text-center text-slate-400 text-sm"
                  >
                    No version found
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
          totalRecord={data?.data.total ?? 0}
          className="px-8"
        />
      </div>
    </div>
  );
};

export default VersionsManager;
