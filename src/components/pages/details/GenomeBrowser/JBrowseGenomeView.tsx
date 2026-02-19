import { useState, useEffect } from "react";
import { type TriboliumGene } from "@/utils/services/geneService";

type JBrowseGenomeViewProps = {
  triboliumGene: TriboliumGene;
};

const JBrowseGenomeView: React.FC<JBrowseGenomeViewProps> = ({
  triboliumGene,
}) => {
  const { seqname, start, end } = triboliumGene;
  const [height, setHeight] = useState(310);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "jbrowse-height") {
        setHeight(event.data.height);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Construct the isolated page URL with parameters
  const params = new URLSearchParams({
    seqname,
    start,
    end,
  });

  // The isolated page is at /details/jbrowse-isolated/
  const iframeUrl = `/details/jbrowse-isolated/?${params.toString()}`;

  return (
    <div
      className="w-full bg-white rounded-lg border border-neutral-200 overflow-hidden relative shadow-sm"
      style={{ height: `${height}px` }}
    >
      <iframe
        src={iframeUrl}
        className="w-full h-full border-0"
        title="Genome Browser"
        loading="lazy"
        allowFullScreen
      />
    </div>
  );
};

export default JBrowseGenomeView;
