import { useEffect, useState, useMemo, useCallback } from "react";
import { type TriboliumGene } from "@/utils/services/geneService";
import assembly from "@/utils/config/genomebrowser/assembly.json";
import tracks from "@/utils/config/genomebrowser/tracks.json";
import defaultSession from "@/utils/config/genomebrowser/default_session.json";
import configuration from "@/utils/config/genomebrowser/configuration.json";

type JBrowseIsolatedViewProps = {
  triboliumGene: TriboliumGene;
};

const JBrowseIsolatedView: React.FC<JBrowseIsolatedViewProps> = ({
  triboliumGene,
}) => {
  const [jbrowse, setJBrowse] = useState<any>(null);

  useEffect(() => {
    import("@jbrowse/react-linear-genome-view2").then(setJBrowse);
  }, []);

  // Use a callback ref to handle the ResizeObserver safely after JBrowse mounts.
  // This is the key fix for the "stuck height" problem.
  const contentRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;

    let timeoutId: ReturnType<typeof setTimeout>;
    const observer = new ResizeObserver((entries) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const entry = entries[0];
        if (entry) {
          // Use getBoundingClientRect for the most accurate non-stretching height
          const height = Math.ceil(node.getBoundingClientRect().height);
          window.parent.postMessage({ type: "jbrowse-height", height }, "*");
        }
      }, 50);
    });

    observer.observe(node);
    // We don't strictly need to return a cleanup function from a callback ref,
    // but if the node changes, ResizeObserver automatically handles it
    // when garbage collected or we could store it in a local ref if needed.
  }, []);

  const state = useMemo(() => {
    if (!jbrowse) return null;

    const { seqname, start: startStr, end: endStr } = triboliumGene;
    const start = parseInt(startStr);
    const end = parseInt(endStr);
    const halfLength = (end - start) / 2;
    const zoomedInStart = Math.max(0, start - halfLength);
    const zoomedInEnd = end + halfLength;
    const zoomedInLocationStr = `${seqname}:${Math.floor(zoomedInStart)}..${Math.floor(zoomedInEnd)}`;

    const { createViewState } = jbrowse;
    return createViewState({
      assembly,
      tracks,
      defaultSession,
      configuration,
      location: zoomedInLocationStr,
    });
  }, [jbrowse, triboliumGene]);

  if (!jbrowse || !state) {
    return null; // Empty page inside iframe while loading
  }

  const { JBrowseLinearGenomeView } = jbrowse;

  return (
    <div
      id="jbrowse-container"
      ref={contentRef}
      className="overflow-hidden inline-block w-full"
    >
      <JBrowseLinearGenomeView viewState={state} />
    </div>
  );
};

export default JBrowseIsolatedView;
