import { XMLParser } from "fast-xml-parser";

export type PubMedArticle = {
  title: string;
  abstract: string;
  journal: string;
  year: string;
  authors: {
    firstName: string;
    lastName: string;
  }[];
  doi: string;
};

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
});

function normalizeAbstract(abstract: any): string {
  if (!abstract?.AbstractText) return "";

  const parts = Array.isArray(abstract.AbstractText)
    ? abstract.AbstractText
    : [abstract.AbstractText];

  return parts
    .map((p: any) => {
      // fast-xml-parser outputs text under "#text"
      if (typeof p === "string") return p;

      const text = p["#text"] ?? "";
      const label = p["@_Label"];

      return label ? `${label}: ${text}` : text;
    })
    .filter(Boolean)
    .join("\n\n");
}

/**
 * Fetch and parse a PubMed article by PMID
 */
export async function fetchPubMedArticle(
  pmid: string,
  apiKey?: string,
): Promise<PubMedArticle | null> {
  const params = new URLSearchParams({
    db: "pubmed",
    id: pmid,
    retmode: "xml",
  });

  if (apiKey) {
    params.set("api_key", apiKey);
  }

  const url =
    "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?" +
    params.toString();

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`PubMed fetch failed: ${res.status}`);
  }

  const xmlText = await res.text();
  const json = parser.parse(xmlText);

  const pubmedArticle = json?.PubmedArticleSet?.PubmedArticle;

  const article = Array.isArray(pubmedArticle)
    ? pubmedArticle[0]?.MedlineCitation
    : pubmedArticle?.MedlineCitation;

  if (!article) return null;

  const articleInfo = article.Article;

  const abstract = normalizeAbstract(articleInfo.Abstract);

  const authors =
    articleInfo.AuthorList?.Author?.map((a: any) => ({
      firstName: a.ForeName ?? "",
      lastName: a.LastName ?? "",
    })) ?? [];

  const articleIds =
    articleInfo.ELocationID ?? articleInfo?.ArticleIdList?.ArticleId ?? [];

  const doiEntry = Array.isArray(articleIds)
    ? articleIds.find((id) => id["@_EIdType"] === "doi")
    : articleIds["@_EIdType"] === "doi"
      ? articleIds
      : null;

  return {
    title: articleInfo.ArticleTitle ?? "",
    abstract,
    journal: articleInfo.Journal?.Title ?? "",
    year: articleInfo.Journal?.JournalIssue?.PubDate?.Year.toString() ?? "",
    authors,
    doi: doiEntry?.["#text"] ?? "",
  };
}

type PubMedCitationStyle = {
  orig: string;
  format: string;
};

export type PubMedCitations = {
  id: string;
  ama?: PubMedCitationStyle;
  apa?: PubMedCitationStyle;
  mla?: PubMedCitationStyle;
  nlm?: PubMedCitationStyle;
};

export async function fetchPubMedCitation(
  pmid: string,
): Promise<PubMedCitations | null> {
  const res = await fetch(`/api/pubmed/${pmid}`);
  if (!res.ok) return null;
  return res.json();
}
