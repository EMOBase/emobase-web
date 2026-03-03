import { createDirectus, rest } from "@directus/sdk";
import type { Schema } from "./directus-schema";
import { getEnv } from "./env";

export * from "./directus-schema";

const directusUrl = getEnv("PUBLIC_DIRECTUS_URL");

export const directus = createDirectus<Schema>(directusUrl).with(rest());
