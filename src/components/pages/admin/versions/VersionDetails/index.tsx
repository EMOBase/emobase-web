import React, { useState, useEffect } from "react";
import { toast } from "sonner";

import { formatBytes } from "@/utils/format";
import useAsyncData from "@/hooks/useAsyncData";
import genomicsService from "@/utils/services/genomics";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import type { VersionDetailFiles } from "@/utils/services/genomics";
import useService from "@/hooks/useService";
import { FileCard, GffFileCard, OrthologyFileCard, type FileStatus } from "./FileCard";
import AddOrthologyDialog from "./AddOrthologyDialog";

const MAIN_FILE_CONFIGS: Record<
  string,
  { category: string; icon: string; theme?: "orange" | "blue" }
> = {
  "genomic.fna": {
    category: "Genome Sequence",
    icon: "description",
  },
  "genomic.gff": {
    category: "Genome Annotation",
    icon: "numbers",
  },
  "rna.fna": {
    category: "RNA Sequences",
    icon: "science",
  },
  "cds.fna": {
    category: "Coding Sequences",
    icon: "data_object",
  },
  "protein.faa": {
    category: "Protein Sequences",
    icon: "conversion_path",
  },
};

const VersionDetails: React.FC<{ name?: string }> = ({ name = "" }) => {
  const { fetchVersionDetail, releaseVersion } =
    useService(genomicsService);

  const [refreshKey, setRefreshKey] = useState(0);
  const [isReleasing, setIsReleasing] = useState(false);

  const handleRelease = async () => {
    try {
      setIsReleasing(true);
      await releaseVersion(name);
      toast.success(`Successfully initiated release for version ${name}`);
      refresh();
    } catch (err: any) {
      toast.error(err.message || `Failed to release version ${name}`);
    } finally {
      setIsReleasing(false);
    }
  };

  const { data } = useAsyncData(
    () => fetchVersionDetail(name),
    [name, refreshKey, fetchVersionDetail],
  );

  const refresh = () => setRefreshKey((prev) => prev + 1);

  const versionData = data?.data;

  useEffect(() => {
    const status = versionData?.status;
    if (status === "PROCESSING") {
      const interval = setInterval(refresh, 5000);
      return () => clearInterval(interval);
    }
  }, [data]);

  const [isAddOrthologyOpen, setIsAddOrthologyOpen] = useState(false);

  const [orthologyUploads, setOrthologyUploads] = useState<Array<{
    id: string;
    file: File;
    order: number;
    algorithm: string;
  }>>([]);

  const handleOrthologyUpload = (
    file: File,
    order: number,
    algorithm: string,
  ) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setIsAddOrthologyOpen(false);
    setOrthologyUploads((prev) => [...prev, { id, file, order, algorithm }]);
  };

  const mainFiles = React.useMemo(() => {
    const files = versionData?.files || {};
    return Object.entries(MAIN_FILE_CONFIGS).map(([fileName, config]) => {
      let status: FileStatus["status"] = "PENDING";
      let progress = 0;
      let progressTitle = "";
      let error = "";
      let size = "";

      const fileDetail = files[fileName as keyof VersionDetailFiles];
      const typedFileDetail = Array.isArray(fileDetail)
        ? fileDetail[0]
        : fileDetail;

      if (typedFileDetail) {
        size = formatBytes(typedFileDetail.fileSize);

        if (typedFileDetail.uploadStatus === "FAILED") {
          status = "ERROR";
          error = "Upload failed";
          progress = 100;
        } else if (typedFileDetail.uploadStatus === "UPLOADING") {
          status = "PAUSED";
          progress = 50;
          progressTitle = "INTERRUPTED";
        } else {
          const jobs = typedFileDetail.jobs || [];
          const failedJob = jobs.find((j: any) => j.status === "FAILED");
          const activeJob = jobs.find(
            (j: any) => j.status === "RUNNING" || j.status === "PENDING",
          );

          if (failedJob) {
            status = "ERROR";
            error = failedJob.error || "Processing failed";
            progress = 100;
          } else if (activeJob) {
            status = "PROCESSING";
            const doneJobsCount = jobs.filter(
              (j: any) => j.status === "DONE",
            ).length;
            progress = Math.min(100, Math.max(10, doneJobsCount * 20));
            progressTitle = activeJob.description || "PROCESSING DATA";
          } else {
            status = "READY";
            progress = 100;
          }
        }
      }

      return {
        id: typedFileDetail?.id,
        name: fileName,
        ...config,
        status,
        progress,
        progressTitle,
        error,
        size,
        theme: status === "READY" ? "blue" : "orange",
      } as FileStatus;
    });
  }, [versionData]);

  const orthologyFiles = React.useMemo(() => {
    const files = versionData?.files?.["orthology.tsv"] || [];

    return files.map((fileDetail) => {
      let status: FileStatus["status"] = "PENDING";
      let progress = 0;
      let progressTitle = "";
      let error = "";
      const size = formatBytes(fileDetail.fileSize);

      if (fileDetail.uploadStatus === "FAILED") {
        status = "ERROR";
        error = "Upload failed";
        progress = 100;
      } else if (fileDetail.uploadStatus === "UPLOADING") {
        status = "PAUSED";
        progress = 50;
        progressTitle = "INTERRUPTED";
      } else {
        const jobs = fileDetail.jobs || [];
        const failedJob = jobs.find((j: any) => j.status === "FAILED");
        const activeJob = jobs.find(
          (j: any) => j.status === "RUNNING" || j.status === "PENDING",
        );

        if (failedJob) {
          status = "ERROR";
          error = failedJob.error || "Processing failed";
          progress = 100;
        } else if (activeJob) {
          status = "PROCESSING";
          const doneJobsCount = jobs.filter(
            (j: any) => j.status === "DONE",
          ).length;
          progress = Math.min(100, Math.max(10, doneJobsCount * 20));
          progressTitle = activeJob.description || "PROCESSING DATA";
        } else {
          status = "READY";
          progress = 100;
        }
      }

      const fileName = fileDetail.filePath.split("/").pop() || "orthology.tsv";

      return {
        id: fileDetail.id,
        name: fileName,
        category: "Orthology Mapping",
        icon: "tsv",
        status,
        progress,
        progressTitle,
        error,
        size,
        theme: status === "READY" ? "blue" : "orange",
      } as FileStatus;
    });
  }, [versionData]);

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Info */}
      <div className="px-2 space-y-4">
        <a
          href="/admin/versions"
          className="inline-flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-primary transition-colors group tracking-widest uppercase"
        >
          <Icon
            name="arrow_back"
            className="text-lg group-hover:-translate-x-1 transition-transform"
          />
          Back to Data Management
        </a>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-slate-900 font-display tracking-tight">
              Version {name}
            </h1>
            {versionData?.isDefault && (
              <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-primary-light/20 text-primary-bold">
                CURRENT
              </span>
            )}
          </div>
          {versionData?.status === "READY" && !versionData?.isDefault && (
            <Button
              onClick={handleRelease}
              disabled={isReleasing}
              className="font-bold text-xs px-4 py-2"
            >
              <Icon
                name={isReleasing ? "pending" : "check_circle"}
                className="text-lg mr-2"
              />
              SET AS DEFAULT
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4 relative">
        {mainFiles.map((file) =>
          file.name === "genomic.gff" ? (
            <GffFileCard
              key={file.name}
              file={file}
               versionId={name}
               onRefresh={refresh}
             />
           ) : (
             <FileCard
               key={file.name}
               file={file}
               versionId={name}
               onRefresh={refresh}
            />
          ),
        )}
      </div>

      <div className="bg-slate-50/50 rounded-3xl border border-slate-100 p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-wider uppercase">
              ADDITIONAL ORTHOLOGY FILES
            </h2>
            <p className="text-slate-500 text-xs mt-1 font-medium">
              Supplementary clinical evidence and batch records
            </p>
          </div>
          <Button
            variant="outline"
            className="font-bold text-xs px-4 py-2"
            onClick={() => setIsAddOrthologyOpen(true)}
          >
            <Icon name="add_circle" weight={500} className="text-lg" />
            APPEND DATASET
          </Button>
        </div>

        <div className="space-y-4">
          {orthologyFiles.length > 0 ? (
            orthologyFiles.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                canDelete={true}
                onRefresh={refresh}
                size="sm"
              />
            ))
          ) : (
            <div className="text-center py-8 text-slate-400 text-sm font-medium">
              No additional orthology files uploaded yet.
            </div>
          )}

          {orthologyUploads.map((item) => (
            <OrthologyFileCard
              key={item.id}
              file={item.file}
              versionId={name}
              order={item.order}
              algorithm={item.algorithm}
              onComplete={() => {
                setOrthologyUploads((prev) => prev.filter((u) => u.id !== item.id));
                refresh();
              }}
            />
          ))}
        </div>
      </div>
      <AddOrthologyDialog
        isOpen={isAddOrthologyOpen}
        onClose={() => setIsAddOrthologyOpen(false)}
        onConfirm={handleOrthologyUpload}
      />
    </div>
  );
};

export default VersionDetails;
