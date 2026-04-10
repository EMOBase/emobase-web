import React from "react";
import { twMerge } from "tailwind-merge";

import { Icon } from "@/components/ui/icon";
import TableFooter from "@/components/common/TableFooter";

import CreateVersionButton from "./CreateVersionButton";

interface Version {
  id: string;
  status: "PROCESSING" | "LIVE" | "ARCHIVED";
  isCurrent?: boolean;
  createdDate: string;
  totalSize: string;
}

const mockVersions: Version[] = [
  {
    id: "Tcas5.2",
    status: "PROCESSING",
    createdDate: "Oct 24, 2023, 11:15 AM",
    totalSize: "412.5 GB",
  },
  {
    id: "Tcas5.1",
    status: "LIVE",
    isCurrent: true,
    createdDate: "Oct 20, 2023, 09:30 AM",
    totalSize: "1.2 TB",
  },
  {
    id: "Tcas4.5",
    status: "ARCHIVED",
    createdDate: "Sep 12, 2023, 04:45 PM",
    totalSize: "890.1 GB",
  },
];

const StatusBadge = ({ status }: { status: Version["status"] }) => {
  const styles = {
    PROCESSING: "bg-amber-50 text-amber-600 border-amber-200/50",
    LIVE: "bg-emerald-50 text-emerald-600 border-emerald-200/50",
    ARCHIVED: "bg-slate-100 text-slate-500 border-slate-200/50",
  };

  return (
    <div className="flex items-center gap-2">
      <span
        className={twMerge(
          "px-2.5 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider border",
          styles[status],
        )}
      >
        {status}
      </span>
    </div>
  );
};

const VersionsManager: React.FC = () => {
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
              {mockVersions.map((version) => (
                <tr
                  key={version.id}
                  className="group hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-8 py-6 relative">
                    <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-700 tracking-tight">
                        {version.id}
                      </span>
                      {version.isCurrent && (
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
                    {version.createdDate}
                  </td>
                  <td className="px-8 py-6 text-slate-500 font-bold text-sm">
                    {version.totalSize}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {version.status === "PROCESSING" ? (
                        <button className="p-2 text-slate-300 hover:text-rose-500 rounded-lg transition-colors">
                          <Icon name="close" className="text-xl" />
                        </button>
                      ) : (
                        <>
                          {version.isCurrent && (
                            <button className="p-2 text-slate-300 hover:text-primary rounded-lg transition-colors">
                              <Icon name="edit" className="text-xl" />
                            </button>
                          )}
                          <button className="p-2 text-slate-300 hover:text-primary rounded-lg transition-colors">
                            <Icon name="download" className="text-xl" />
                          </button>
                          {!version.isCurrent && (
                            <button className="p-2 text-slate-300 hover:text-rose-500 rounded-lg transition-colors">
                              <Icon name="delete" className="text-xl" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <TableFooter
          itemsPerPage={10}
          setItemsPerPage={() => {}}
          page={1}
          setPage={() => {}}
          totalRecord={3}
          className="px-8"
        />
      </div>
    </div>
  );
};

export default VersionsManager;
