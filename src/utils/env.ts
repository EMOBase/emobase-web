const getPublicServer = (): string => {
  try {
    if (typeof window !== "undefined") {
      return (
        (window as any).__ENV__?.PUBLIC_SERVER ||
        (import.meta.env as any)?.PUBLIC_SERVER ||
        window.location.origin ||
        ""
      );
    }

    const processEnv = typeof process !== "undefined" ? process.env : {};
    return (
      processEnv.PUBLIC_SERVER || (import.meta.env as any)?.PUBLIC_SERVER || ""
    );
  } catch {
    if (typeof window !== "undefined" && window.location?.origin) {
      return window.location.origin;
    }
    return "";
  }
};

const getDefaultValues = (publicServer: string): Record<string, string> => {
  const base = publicServer || "";

  return {
    PUBLIC_APIS_BASE_URL: base + "/ibb/api",
    PUBLIC_DOWNLOAD_URL: base + "/download/",

    PUBLIC_UI_PAGE_GENOMEBROWSER: base + "/ibb/jbrowse2/",
    PUBLIC_UI_PAGE_ONTOSCOPE: base + "/ibb/ontoscope",
    PUBLIC_UI_PAGE_BLAST: base + "/ibb/blast/",
    PUBLIC_UI_PAGE_API_DOC: base + "/ibb/swagger-ui/",

    AUTH_TRUST_HOST: "true",

    KEYCLOAK_ISSUER: base + "/ibb/keycloak/realms/ibb",
    KEYCLOAK_CLIENT_ID: "ibb-client",

    PUBLIC_DIRECTUS_URL: base + "/ibb/directus",
  };
};

/**
 * Utility to access environment variables consistently on both server and client side.
 * In SSR mode, it supports reading variables injected into window.__ENV__ at runtime.
 */
export const getEnv = (key: string): string => {
  try {
    const publicServer = getPublicServer();
    const defaultValues = getDefaultValues(publicServer);

    if (typeof window !== "undefined") {
      // Client-side: try runtime-injected env first, then fall back to build-time env
      return (
        (window as any).__ENV__?.[key] ||
        (import.meta.env as any)?.[key] ||
        defaultValues[key] ||
        ""
      );
    }

    // Server-side: Use process.env for reliable runtime access with dynamic keys.
    // We also check import.meta.env as a fallback for Astro-specific behavior.
    const processEnv = typeof process !== "undefined" ? process.env : {};
    return (processEnv?.[key] ||
      (import.meta.env as any)?.[key] ||
      defaultValues[key] ||
      "") as string;
  } catch (err) {
    console.error(`[getEnv Error] Failed to get key ${key}:`, err);
    return "";
  }
};
