import { useEffect, useState, useMemo } from "react";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import {
  createViewState,
  JBrowseLinearGenomeView,
} from "@jbrowse/react-linear-genome-view2";
import { type GeneDetail } from "@/utils/services/genomics";
import {
  getJBrowseConfig,
  getZoomedInLocation,
  type JBrowseConfig,
} from "@/utils/pages/details/jbrowseConfig";

type JBrowseGenomeViewProps = {
  geneInfo: GeneDetail;
  config?: JBrowseConfig;
};

const JBrowseGenomeView: React.FC<JBrowseGenomeViewProps> = ({
  geneInfo,
  config: serverConfig,
}) => {
  const [config, setConfig] = useState<JBrowseConfig | null>(
    serverConfig ?? null,
  );

  const emotionCache = useMemo(() => {
    const container = document.getElementById("jbrowse-styles-container");
    return createCache({
      key: "jbrowse-native",
      container: container || document.head,
    });
  }, []);

  useEffect(() => {
    if (config) return;
    let cancelled = false;

    const zoomedInLocationStr = getZoomedInLocation(geneInfo);
    if (!zoomedInLocationStr) return;

    getJBrowseConfig(zoomedInLocationStr).then((jbrowseConfig) => {
      if (!cancelled) setConfig(jbrowseConfig);
    });

    return () => {
      cancelled = true;
    };
  }, [geneInfo, config]);

  const state = useMemo(() => {
    if (!config) return null;
    return createViewState(config);
  }, [config]);

  if (!state) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center text-neutral-400 italic bg-neutral-50 rounded-lg border border-dashed border-neutral-200">
        Loading Genome Browser...
      </div>
    );
  }

  return (
    <CacheProvider value={emotionCache}>
      <div className="w-full bg-white rounded-lg border border-neutral-200 overflow-hidden relative shadow-sm">
        <JBrowseLinearGenomeView viewState={state} />
      </div>
    </CacheProvider>
  );
};

export default JBrowseGenomeView;