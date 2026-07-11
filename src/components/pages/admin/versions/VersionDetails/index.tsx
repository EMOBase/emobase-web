import React, { useState, useEffect } from "react";
import { toast } from "sonner";

import useAsyncData from "@/hooks/useAsyncData";
import genomicsService from "@/utils/services/genomics";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import useService from "@/hooks/useService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SpeciesData from "./SpeciesData";

const VersionDetails: React.FC<{ name?: string }> = ({ name = "" }) => {
  const { fetchVersionDetail, releaseVersion } = useService(genomicsService);

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
              <Icon
                name={isReleasing ? "pending" : "check_circle"}
                className="text-lg mr-2"
              />
              SET AS DEFAULT
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
          <SpeciesData name={name} />
        </TabsContent>
        <TabsContent value="fly">
          <SpeciesData name={name} species="Dmel" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VersionDetails;
