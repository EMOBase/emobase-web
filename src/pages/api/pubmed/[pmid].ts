import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const pmid = params.pmid;

  if (!pmid || !/^\d+$/.test(pmid)) {
    return new Response(JSON.stringify({ error: "Invalid PMID" }), {
      status: 400,
    });
  }

  const url = `https://pubmed.ncbi.nlm.nih.gov/${pmid}/citations/`;

  const res = await fetch(url, {
    headers: {
      // Important: PubMed returns JSON only if this is set
      Accept: "application/json",
      "User-Agent": "astro-app (mailto:your-email@example.com)",
    },
  });

  if (!res.ok) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch PubMed citation" }),
      { status: res.status },
    );
  }

  const data = await res.json();

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      // Optional caching (recommended)
      "Cache-Control": "public, max-age=86400",
    },
  });
};
