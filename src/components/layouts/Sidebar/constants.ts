import { getEnv } from "@/utils/env";
import { hasFeature } from "@/utils/features";
import type { NavItem } from "./types";

export const homeItems: NavItem[] = [
  {
    id: "DASHBOARD",
    label: "Home",
    icon: "home",
    href: "/",
  },
  {
    id: "MY_GENES",
    label: "My Genes",
    icon: "star",
  },
];

export const toolItems: NavItem[] = [
  {
    id: "ID_CONVERTER",
    label: "Gene ID Converter",
    icon: "transform",
    href: "/querypipeline",
    disabled: !hasFeature("geneIdConverter"),
  },
  {
    id: "ONTOLOGY_VIEWER",
    label: "Ontology Viewer",
    icon: "schema",
    matchingHref: "/ontology",
    children: [
      {
        label: "Ontoscope",
        href: "/ontology",
      },
      {
        label: "BioPortal",
        href: "http://bioportal.bioontology.org/ontologies/TRON",
        external: true,
      },
    ],
    disabled: !hasFeature("ontologyViewer"),
  },
  {
    id: "GENOME_BROWSER",
    label: "Genome Browser",
    icon: "tab_search",
    href: "/genomebrowser",
  },
  {
    id: "BLAST",
    label: "Blast",
    icon: "genetics",
    matchingHref: "/blast",
    children: [
      {
        label: "iBB Blast",
        href: "/blast",
      },
      {
        label: "NCBI Blast",
        href: "https://blast.ncbi.nlm.nih.gov/Blast.cgi?PAGE_TYPE=BlastSearch&amp;USER_FORMAT_DEFAULTS=on&amp;SET_SAVED_SEARCH=true&amp;PAGE=MegaBlast&amp;PROGRAM=blastn&amp;GAPCOSTS=0%200&amp;MATCH_SCORES=1%2C-2&amp;BLAST_SPEC=OGP__7070__12539&amp;DATABASE=GPIPE/7070/103/ref_top_level&amp;BLAST_PROGRAMS=megaBlast&amp;MAX_NUM_SEQ=100&amp;SHORT_QUERY_ADJUST=on&amp;EXPECT=10&amp;WORD_SIZE=28&amp;REPEATS=7070&amp;TEMPLATE_TYPE=0&amp;TEMPLATE_LENGTH=0&amp;FILTER=L&amp;FILTER=R&amp;FILTER=m&amp;WWW_BLAST_TYPE=mapview&amp;EQ_MENU=Enter%20organism%20name%20or%20id--completions%20will%20be%20suggested&amp;PROG_DEFAULTS=on&amp;SHOW_OVERVIEW=on&amp;SHOW_LINKOUT=on&amp;ALIGNMENT_VIEW=Pairwise&amp;MASK_CHAR=2&amp;MASK_COLOR=1&amp;GET_SEQUENCE=on&amp;NUM_OVERVIEW=100&amp;DESCRIPTIONS=100&amp;ALIGNMENTS=100&amp;FORMAT_OBJECT=Alignment&amp;FORMAT_TYPE=HTML",
        external: true,
      },
    ],
  },
];

export const resourceItems: NavItem[] = [
  {
    label: "API Docs",
    icon: "api",
    href: getEnv("PUBLIC_UI_PAGE_API_DOC"),
    external: true,
  },
  {
    id: "RESOURCES",
    label: "Other Resources",
    icon: "folder_open",
    href: "/resources",
  },
  {
    label: "Help",
    icon: "quiz",
    disabled: !hasFeature("helpPages"),
    children: [
      { label: "About", href: "/help/about" },
      { label: "Data Protection", href: "/help/datenschutz/" },
      { label: "Imprint", href: "/help/impressum/" },
    ],
  },
];

export const getActiveView = (url: string): NavItem["id"] | undefined => {
  return homeItems
    .concat(toolItems)
    .concat(resourceItems)
    .find((item) => item.href === url || item.matchingHref === url)?.id;
};
