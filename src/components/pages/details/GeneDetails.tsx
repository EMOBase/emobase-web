import { type IBDsRNA } from "@/utils/constants/ibeetle";
import type {
  TriboliumGene,
  DrosophilaGene,
} from "@/utils/services/geneService";
import { type Phenotype } from "@/utils/constants/phenotype";
import { stringToURLHash } from "@/utils/stringToURLHash";

import GeneOverview from "./GeneOverview";
import GenomeBrowser from "./GenomeBrowser";
import OrthologySection from "./OrthologySection";
import GOAnnotationCRUD from "./GOAnnotationCRUD";
import PublicationCRUD from "./PublicationCRUD";
import PhenotypeCRUD from "./PhenotypeCRUD";
import IBScreen from "./IBScreen";
import TableOfContents from "./TableOfContents";

type GeneDetailsProps = {
  gene: string;
  triboliumGene: TriboliumGene;
  dsRNAs: IBDsRNA[];
  phenotypes: Phenotype[];
  homologs: (DrosophilaGene & { source: string[] })[];
};

const GeneDetails: React.FC<GeneDetailsProps> = ({
  gene,
  triboliumGene,
  dsRNAs,
  phenotypes,
  homologs,
}) => {
  const communityPhenotypes =
    phenotypes === undefined
      ? undefined
      : phenotypes.filter((p) => !p.iBeetleExperiment);
  const iBeetlePhenotypes =
    phenotypes === undefined
      ? undefined
      : phenotypes
          .filter((p) => p.iBeetleExperiment)
          .reduce(
            (acc, p) => {
              const dsRNAName = p.dsRNA.name || "Unknown";
              if (acc[dsRNAName]) {
                acc[dsRNAName].push(p);
              } else {
                acc[dsRNAName] = [p];
              }
              return acc;
            },
            {} as Record<string, typeof phenotypes>,
          );

  const sections = [
    {
      header: "Overview",
      component: GeneOverview,
      props: {
        gene,
        triboliumGene,
      },
    },
    {
      header: "Genome Browser",
      component: GenomeBrowser,
      props: {
        triboliumGene,
      },
    },
    {
      header: "Closest Fly Homologs",
      component: OrthologySection,
      props: {
        gene,
        homologs,
      },
    },
    {
      header: "Gene Ontology",
      component: GOAnnotationCRUD,
      props: {
        gene,
      },
    },
    {
      header: "Publications",
      component: PublicationCRUD,
      props: {
        gene,
      },
    },
    {
      header: "RNAi Phenotypes contributed by the Community",
      shortHeader: "Community Phenotypes",
      component: PhenotypeCRUD,
      props: {
        gene,
        phenotypes: communityPhenotypes,
        dsRNAs,
      },
    },
    ...(dsRNAs || []).map((dsrna) => ({
      header: `RNAi Phenotypes from iBeetle Screen ${dsrna.id}`,
      shortHeader: `iBeetle Screen ${dsrna.id}`,
      component: IBScreen,
      props: {
        dsrna,
        phenotypes: iBeetlePhenotypes?.[dsrna.id] || [],
      },
    })),
  ];

  const getSectionId = ({
    header,
    shortHeader,
  }: {
    header: string;
    shortHeader?: string;
  }) => {
    return stringToURLHash(shortHeader || header);
  };

  const toc = sections.map((panel) => ({
    id: getSectionId(panel),
    title: panel.shortHeader || panel.header,
  }));

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10">
      <div className="flex-1 flex flex-col gap-10 min-w-0">
        {sections.map((section) => {
          const sectionId = getSectionId(section);
          const props = section.props;
          const Component = section.component as React.FC<
            typeof props & { id: string; title: string }
          >;

          return (
            <Component
              key={sectionId}
              id={sectionId}
              title={section.header}
              {...props}
            />
          );
        })}
      </div>
      <TableOfContents items={toc} />
    </div>
  );
};

export default GeneDetails;
