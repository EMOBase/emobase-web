import React, { useState } from "react";

import { formatBytes } from "@/utils/format";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import type { FileDetail, VersionDetailFiles } from "@/utils/services/genomics";
import {
  FileCard,
  GffFileCard,
  JBrowseTrackFileCard,
  SynonymFileCard,
  type FileStatus,
} from "../FileCard";
import AddJBrowseTrackButton from "../AddJBrowseTrackButton";

import { hasFeature } from "@/utils/features";
import type { IconName } from "@/utils/constants/icon";
import { mainSpecies } from "@/utils/mainSpecies";

type MainFileConfig = {
  category: string;
  icon: IconName;
  theme?: "orange" | "blue";
};

const getMainFileConfigs = (): Record<string, MainFileConfig> => {
  const configs: Record<string, MainFileConfig> = {
    "genomic.fna": { category: "Genome Sequence", icon: "description" },
    "genomic.gff": { category: "Genome Annotation", icon: "numbers" },
    "rna.fna": { category: "RNA Sequences", icon: "science" },
    "cds.fna": { category: "Coding Sequences", icon: "data_object" },
    "protein.faa": { category: "Protein Sequences", icon: "conversion_path" },
  };

  if (hasFeature("dsrnaUpload")) {
    configs["dsrna.csv"] = { category: "dsRNA Silencing", icon: "microbiology" };
  }

  return configs;
};

const ALL_FILE_TYPES = new Set([
  "genomic.fna", "genomic.gff", "rna.fna", "cds.fna", "protein.faa",
  "dsrna.csv", "jbrowse.track", "species.synonym",
]);

const SpeciesData: React.FC<{
  name?: string;
  species?: string;
  versionData?: any;
  onRefresh?: () => void;
  enabledFileTypes?: Set<string>;
}> = ({ name = "", species = mainSpecies, versionData, onRefresh, enabledFileTypes = ALL_FILE_TYPES }) => {
  const refresh = onRefresh || (() => {});

  const [jbrowseTrackUploads, setJBrowseTrackUploads] = useState<
    Array<{
      id: string;
      file: File;
      trackName: string;
      category?: string;
    }>
  >([]);

  const handleJBrowseTrackUpload = (
    file: File,
    trackName: string,
    category?: string,
  ) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setJBrowseTrackUploads((prev) => [...prev, { id, file, trackName, category }]);
  };

  const [synonymUploads, setSynonymUploads] = useState<
    Array<{
      id: string;
      file: File;
    }>
  >([]);

  const handleSynonymUpload = (file: File) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setSynonymUploads((prev) => [...prev, { id, file }]);
  };

  const mainFiles = React.useMemo(() => {
    const files = versionData?.files || {};
    return Object.entries(getMainFileConfigs()).map(([fileName, config]) => {
      const isEnabled = enabledFileTypes.has(fileName);

      if (!isEnabled) {
        return {
          name: fileName,
          ...config,
          status: "DISABLED" as const,
        } as FileStatus;
      }

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
  }, [versionData, enabledFileTypes]);

  const jbrowseTrackFiles: FileStatus[] = React.useMemo(() => {
    if (!enabledFileTypes.has("jbrowse.track")) return [];

    const files: FileDetail[] = versionData?.files?.["jbrowse.track"] || [];

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

      const fileName = fileDetail.filePath.split("/").pop() || "jbrowse.track";

      return {
        id: fileDetail.id,
        name: fileName,
        category: "JBrowse2 Track",
        icon: "view_timeline" as const,
        status,
        progress,
        progressTitle,
        error,
        size,
        theme: status === "READY" ? "blue" : "orange",
      } as FileStatus;
    });
  }, [versionData, enabledFileTypes]);

  const synonymFiles: FileStatus[] = React.useMemo(() => {
    if (!enabledFileTypes.has("species.synonym")) return [];

    const files: FileDetail[] = versionData?.files?.["species.synonym"] || [];

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

      const fileName = fileDetail.filePath.split("/").pop() || "species.synonym";

      return {
        id: fileDetail.id,
        name: fileName,
        category: "Synonyms",
        icon: "menu_book" as const,
        status,
        progress,
        progressTitle,
        error,
        size,
        theme: status === "READY" ? "blue" : "orange",
      } as FileStatus;
    });
  }, [versionData, enabledFileTypes]);

  return (
    <div className="border-l-2 border-slate-100 pl-6 space-y-8">
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

      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-wider uppercase">
              JBROWSE2 TRACK FILES
            </h2>
            <p className="text-slate-500 text-xs mt-1 font-medium">
              Visualisation tracks for the JBrowse2 genome browser.
            </p>
          </div>
          {enabledFileTypes.has("jbrowse.track") && (
            <AddJBrowseTrackButton onConfirm={handleJBrowseTrackUpload} />
          )}
        </div>

        <div className="space-y-4">
          {!enabledFileTypes.has("jbrowse.track") ? (
            <div className="text-center py-8 text-slate-400 text-sm font-medium">
              Not available for {species}.
            </div>
          ) : jbrowseTrackFiles.length > 0 ? (
            jbrowseTrackFiles.map((file) => (
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
              No JBrowse2 track files uploaded yet.
            </div>
          )}

          {enabledFileTypes.has("jbrowse.track") && jbrowseTrackUploads.map((item) => (
            <JBrowseTrackFileCard
              key={item.id}
              file={item.file}
              versionId={name}
              trackName={item.trackName}
              category={item.category}
              onComplete={() => {
                setJBrowseTrackUploads((prev) =>
                  prev.filter((u) => u.id !== item.id),
                );
                refresh();
              }}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-wider uppercase">
              SYNONYMS
            </h2>
            <p className="text-slate-500 text-xs mt-1 font-medium">
              Gene synonym files.
            </p>
          </div>
          {enabledFileTypes.has("species.synonym") && (
            <Button variant="outline" className="font-bold text-xs px-4 py-2" asChild>
              <label>
                <Icon name="add_circle" weight={500} className="text-lg" />
                ADD SYNONYM FILE
                <input
                  type="file"
                  className="hidden"
                  accept=".gz,.bgz"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      handleSynonymUpload(f);
                    }
                    e.target.value = "";
                  }}
                />
              </label>
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {!enabledFileTypes.has("species.synonym") ? (
            <div className="text-center py-8 text-slate-400 text-sm font-medium">
              Not available for {species}.
            </div>
          ) : synonymFiles.length > 0 ? (
            synonymFiles.map((file) => (
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
              No synonym files uploaded yet.
            </div>
          )}

          {enabledFileTypes.has("species.synonym") && synonymUploads.map((item) => (
            <SynonymFileCard
              key={item.id}
              file={item.file}
              versionId={name}
              species={species}
              onComplete={() => {
                setSynonymUploads((prev) =>
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

export default SpeciesData;
