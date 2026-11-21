import { createDirectus, rest } from "@directus/sdk";
import type { Schema } from "./directus-schema";
import { directusUrl, getDirectusUrl } from "./url";

export * from "./directus-schema";

if (
  !directusUrl &&
  typeof process !== "undefined" &&
  process.env.NODE_ENV !== "test"
) {
  console.warn(
    "\x1b[33m%s\x1b[0m",
    "⚠️  [EMOBase] PUBLIC_DIRECTUS_URL is not set. Directus SDK initialization might fail or pages using Directus data will error.",
  );
  console.warn(
    "\x1b[33m%s\x1b[0m",
    "Please set PUBLIC_DIRECTUS_URL in your environment or .env file.",
  );
}

export const directus = createDirectus<Schema>(getDirectusUrl()).with(rest());

export const getAssetUrl = (id: string) =>
  directusUrl ? `${directusUrl}/assets/${id}` : "";
