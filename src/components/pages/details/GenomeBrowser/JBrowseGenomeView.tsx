import { useMemo } from "react";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import {
  createViewState,
  JBrowseLinearGenomeView,
} from "@jbrowse/react-linear-genome-view2";
import { type JBrowseConfig } from "@/utils/pages/details/jbrowseConfig";

type JBrowseGenomeViewProps = {
  config: JBrowseConfig;
};

const JBrowseGenomeView: React.FC<JBrowseGenomeViewProps> = ({
  config,
}) => {
  const emotionCache = useMemo(() => {
    const container = document.getElementById("jbrowse-styles-container");
    return createCache({
      key: "jbrowse-native",
      container: container || document.head,
    });
  }, []);

  const state = useMemo(() => createViewState(config), [config]);

  return (
    <CacheProvider value={emotionCache}>
      <div className="w-full bg-white rounded-lg border border-neutral-200 overflow-hidden relative shadow-sm">
        <JBrowseLinearGenomeView viewState={state} />
      </div>
    </CacheProvider>
  );
};

export default JBrowseGenomeView;