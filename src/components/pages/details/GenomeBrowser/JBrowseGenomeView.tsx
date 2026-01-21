import { useEffect, useState } from "react";

import { type TriboliumGene } from "@/utils/services/geneService";
import assembly from "@/utils/config/genomebrowser/assembly.json";
import tracks from "@/utils/config/genomebrowser/tracks.json";
import defaultSession from "@/utils/config/genomebrowser/default_session.json";

import configuration from "@/utils/config/genomebrowser/configuration.json";

type JBrowseGenomeViewProps = {
  triboliumGene: TriboliumGene;
};

const JBrowseGenomeView: React.FC<JBrowseGenomeViewProps> = ({
  triboliumGene,
}) => {
  const { seqname, start: startStr, end: endStr } = triboliumGene;

  const start = parseInt(startStr);
  const end = parseInt(endStr);
  const halfLength = (end - start) / 2;

  const zoomedInStart = start - halfLength < 0 ? 0 : start - halfLength;
  const zoomedInEnd = end + halfLength;
  const zoomedInLocation = {
    refName: seqname,
    start: Math.floor(zoomedInStart),
    end: Math.floor(zoomedInEnd),
  };
  const zoomedInLocationStr = `${zoomedInLocation.refName}:${zoomedInLocation.start}..${zoomedInLocation.end}`;

  const [jbrowse, setJBrowse] = useState<any>(null);

  useEffect(() => {
    import("@jbrowse/react-linear-genome-view2").then(setJBrowse);
  }, []);

  if (!jbrowse) return null;

  const { createViewState, JBrowseLinearGenomeView } = jbrowse;

  const state = createViewState({
    assembly,
    tracks,
    defaultSession,
    configuration,
    location: zoomedInLocationStr,
  });

  return <JBrowseLinearGenomeView viewState={state} />;
};

export default JBrowseGenomeView;
