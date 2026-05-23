export type GffParseResult = {
  attributes: Record<string, string[]>;
  subAttributesMap: Record<string, string[]>;
};

export async function parseFirstGeneLineFromGffGz(
  file: File,
): Promise<GffParseResult | null> {
  if (typeof DecompressionStream === "undefined") {
    throw new Error(
      "Your browser does not support DecompressionStream. Please use a modern browser like Chrome, Firefox, or Safari.",
    );
  }

  const decompressionStream = new DecompressionStream("gzip");
  const decompressedStream = file.stream().pipeThrough(decompressionStream);
  const reader = decompressedStream.getReader();
  const decoder = new TextDecoder("utf-8");

  let buffer = "";
  let geneLine: string | null = null;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (value) {
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split(/\r?\n/);
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith("#")) {
            continue;
          }
          const cols = trimmed.split("\t");
          if (cols.length >= 9 && cols[2].toLowerCase() === "gene") {
            geneLine = trimmed;
            break;
          }
        }
      }
      if (done || geneLine) {
        break;
      }
    }
  } finally {
    try {
      await reader.cancel();
    } catch {
      // Ignore reader cancel errors
    }
  }

  if (!geneLine) {
    return null;
  }

  const cols = geneLine.split("\t");
  const attributesStr = cols[8];

  const attributes: Record<string, string[]> = {};
  const attrPairs = attributesStr.split(";");
  for (const pair of attrPairs) {
    const trimmedPair = pair.trim();
    if (!trimmedPair) continue;
    const eqIdx = trimmedPair.indexOf("=");
    if (eqIdx !== -1) {
      const key = trimmedPair.substring(0, eqIdx).trim();
      const valStr = trimmedPair.substring(eqIdx + 1).trim();
      const values = valStr.split(",").map((v) => v.trim());
      attributes[key] = values;
    }
  }

  const subAttributesMap: Record<string, string[]> = {};
  for (const [key, values] of Object.entries(attributes)) {
    const subs: string[] = [];
    for (const val of values) {
      const colonIdx = val.indexOf(":");
      if (colonIdx !== -1) {
        const subName = val.substring(0, colonIdx).trim();
        const subVal = val.substring(colonIdx + 1).trim();
        if (subName && subVal && !subs.includes(subName)) {
          subs.push(subName);
        }
      }
    }
    if (subs.length > 0) {
      subAttributesMap[key] = subs;
    }
  }

  return { attributes, subAttributesMap };
}

export const GFF_NO_GENE_ERROR =
  "Could not find any 'gene' features in the GFF file. Please verify that this is a valid GFF3 file and contains features of type 'gene'.";
