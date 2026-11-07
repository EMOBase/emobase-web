import { getEnv, getUrlEnv } from "./env";
import { API_SERVICE_ENVS, type ApiService } from "./constants/api";

export const directusUrl = getUrlEnv("PUBLIC_DIRECTUS_URL");
export const keycloakIssuerUrl = getUrlEnv("KEYCLOAK_ISSUER");
export const apiBaseUrl = getUrlEnv("PUBLIC_APIS_BASE_URL");
export const jbrowseBaseUrl = getUrlEnv("PUBLIC_UI_PAGE_GENOMEBROWSER");

export const getKeyCloakBaseUrl = (issuerUrl: string) => {
  const ibbIndex = issuerUrl.indexOf("/ibb/keycloak/");
  return ibbIndex !== -1 ? issuerUrl.substring(0, ibbIndex) : "";
};

export const keycloakBaseUrl = getKeyCloakBaseUrl(keycloakIssuerUrl);

const isServer = () => typeof window === "undefined";
const trimTrailingSlash = (url: string) => url.replace(/\/+$/, "");
const warned = new Set<string>();

const isAbsoluteUrl = (url: string) => /^https?:\/\//i.test(url);

const isLoopbackUrl = (url: string): boolean => {
  try {
    const hostname = new URL(url).hostname;
    return ["localhost", "127.0.0.1", "::1"].includes(hostname);
  } catch {
    return false;
  }
};

const warnOnce = (key: string, message: string) => {
  if (warned.has(key)) return;
  warned.add(key);
  console.warn(message);
};

const getInternalUrl = (key: string): string => {
  const value = getEnv(key).trim();
  if (!value) return "";

  if (!isAbsoluteUrl(value)) {
    warnOnce(
      key,
      `[urls] ${key} must be an absolute URL; ignoring relative value "${value}".`,
    );
    return "";
  }

  return trimTrailingSlash(value);
};

const warnIfLoopbackFallback = (
  publicKey: string,
  internalKey: string,
  publicUrl: string,
) => {
  if (!isLoopbackUrl(publicUrl)) return;

  warnOnce(
    internalKey,
    `[urls] ${internalKey} is not set and ${publicKey} points at loopback ` +
      `(${publicUrl}). Server-side calls will target the current container.`,
  );
};

/**
 * Public URL for a service. This is always the browser-facing URL.
 */
export const getPublicApiBaseUrl = (service: ApiService): string => {
  const publicUrl =
    getUrlEnv(API_SERVICE_ENVS[service].public) ||
    `${apiBaseUrl}/${service}/v1`;
  return trimTrailingSlash(publicUrl);
};

/**
 * URL used for server-side API calls. Prefers INTERNAL_API_* and falls back
 * to the public URL, which is valid for deployments where the service is on
 * another server.
 */
export const getApiBaseUrl = (service: ApiService): string => {
  const publicUrl = getPublicApiBaseUrl(service);
  if (!isServer()) return publicUrl;

  const { public: publicKey, internal: internalKey } =
    API_SERVICE_ENVS[service];
  const internalUrl = getInternalUrl(internalKey);
  if (internalUrl) return internalUrl;

  warnIfLoopbackFallback(publicKey, internalKey, publicUrl);
  return publicUrl;
};

export const getDirectusUrl = (): string => {
  const publicUrl = trimTrailingSlash(getUrlEnv("PUBLIC_DIRECTUS_URL"));
  if (!isServer()) return publicUrl;

  const internalUrl = getInternalUrl("INTERNAL_DIRECTUS_URL");
  if (internalUrl) return internalUrl;

  warnIfLoopbackFallback(
    "PUBLIC_DIRECTUS_URL",
    "INTERNAL_DIRECTUS_URL",
    publicUrl,
  );
  return publicUrl;
};

export const getKeycloakServerIssuer = (): string => {
  const publicUrl = trimTrailingSlash(getUrlEnv("KEYCLOAK_ISSUER"));
  if (!isServer()) return publicUrl;

  const internalUrl = getInternalUrl("INTERNAL_KEYCLOAK_ISSUER");
  if (internalUrl) return internalUrl;

  warnIfLoopbackFallback(
    "KEYCLOAK_ISSUER",
    "INTERNAL_KEYCLOAK_ISSUER",
    publicUrl,
  );
  return publicUrl;
};

/**
 * Base URL used to fetch the JBrowse2 config.json.
 *
 * Browsers must use the public URL. Server-side calls (the gene details page
 * and the sidebar) prefer INTERNAL_UI_PAGE_GENOMEBROWSER, because a public
 * `localhost` URL points at the web container itself, not at the portal.
 * The public URL is still used to resolve the data URIs inside the config for
 * the browser.
 */
export const getJbrowseConfigBaseUrl = (): string => {
  if (!isServer()) return jbrowseBaseUrl;

  const internalUrl = getInternalUrl("INTERNAL_UI_PAGE_GENOMEBROWSER");
  if (internalUrl) return internalUrl;

  warnIfLoopbackFallback(
    "PUBLIC_UI_PAGE_GENOMEBROWSER",
    "INTERNAL_UI_PAGE_GENOMEBROWSER",
    jbrowseBaseUrl,
  );
  return jbrowseBaseUrl;
};
