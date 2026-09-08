import React, { useState, useEffect } from "react";
import { toast } from "sonner";

import { formatBytes } from "@/utils/format";
import useAsyncData from "@/hooks/useAsyncData";
import genomicsService from "@/utils/services/genomics";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import useService from "@/hooks/useService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileCard, OrthologyFileCard, type FileStatus } from "./FileCard";
import AddOrthologyButton from "./AddOrthologyButton";
import SpeciesData from "./SpeciesData";
import type { VersionDetailFiles } from "@/utils/services/genomics";

const VersionDetails: React.FC<{ name?: string }> = ({ name = "" }) => {
  const { fetchVersionDetail, releaseVersion } = useService(genomicsService);

  const [refreshKey, setRefreshKey] = useState(0);
  const [isReleasing, setIsReleasing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

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

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      await releaseVersion(name);
      toast.success(`Successfully initiated sync for version ${name}`);
      refresh();
    } catch (err: any) {
      toast.error(err.message || `Failed to sync version ${name}`);
    } finally {
      setIsSyncing(false);
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

  const [orthologyUploads, setOrthologyUploads] = useState<
    Array<{
      id: string;
      file: File;
      order: number;
      algorithm: string;
    }>
  >([]);

  const handleOrthologyUpload = (
    file: File,
    order: number,
    algorithm: string,
  ) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setOrthologyUploads((prev) => [...prev, { id, file, order, algorithm }]);
  };

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
              {isReleasing ? (
                <Spinner className="text-lg size-[0.9em] mr-2" />
              ) : (
                <Icon name="check_circle" className="text-lg mr-2" />
              )}
              SET AS DEFAULT
            </Button>
          )}
          {versionData?.isDefault && (
            <Button
              onClick={handleSync}
              disabled={isSyncing}
              className="font-bold text-xs px-4 py-2"
            >
              {isSyncing ? (
                <Spinner className="text-lg size-[0.9em] mr-2" />
              ) : (
                <Icon name="sync" className="text-lg mr-2" />
              )}
              SYNC
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="mainSpecies">
        <TabsList>
          <TabsTrigger value="mainSpecies">Main species (Tcas)</TabsTrigger>
          <TabsTrigger value="fly">Fly (Dmel)</TabsTrigger>
        </TabsList>
        <TabsContent value="mainSpecies">
          <SpeciesData
            name={name}
            versionData={versionData}
            onRefresh={refresh}
          />
        </TabsContent>
        <TabsContent value="fly">
          <SpeciesData
            name={name}
            species="Dmel"
            versionData={versionData}
            onRefresh={refresh}
            enabledFileTypes={new Set(["species.synonym"])}
          />
        </TabsContent>
      </Tabs>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-wider uppercase">
              ADDITIONAL ORTHOLOGY FILES
            </h2>
            <p className="text-slate-500 text-xs mt-1 font-medium">
              Mapping relationships between homologous genes across different
              species.
            </p>
          </div>
          <AddOrthologyButton onConfirm={handleOrthologyUpload} />
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
                setOrthologyUploads((prev) =>
                  prev.filter((u) => u.id !== item.id),
                );
                refresh();
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VersionDetails;
