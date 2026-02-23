import qs from "qs";

import { type ApiService } from "./constants/api";
import { getEnv } from "./env";

/**
 * Resolves the base URL for a given service.
 * In production, this uses internal container names to allow the Astro server
 * to talk directly to backend services within the same Docker network.
 * - Production: http://service:8080/...
 * - Development/Client: Uses the public base URL
 */
export const resolveApiBaseUrl = (service: ApiService) => {
  const isServer = typeof window === "undefined";
  const publicBaseUrl = getEnv("PUBLIC_APIS_BASE_URL");

  // Client side always uses the public URL
  if (!isServer) {
    return `${publicBaseUrl}/${service}/v1`;
  }

  // Server-side logic
  // Automatic service discovery only in production if internal networking is enabled
  const envProd = import.meta.env.PROD || process.env.NODE_ENV === "production";
  if (envProd && getEnv("INTERNAL_API_NETWORKING") === "true") {
    // Internal container talk to each other usually at root or service specific root.
    // Based on Nginx config,backend services expect requests at their root (/).
    return `http://${service}:8080`;
  }

  // Local development fallback
  return `${publicBaseUrl}/${service}/v1`;
};

export const apiFetch = async <T>(
  service: ApiService,
  request: string,
  opts?: Omit<RequestInit, "headers" | "body"> & {
    responseType?: "json" | "text" | "blob" | "formData" | "arrayBuffer";
    body?: any;
    query?: Record<string, string | string[] | null | undefined>;
    authorization?: string;
  },
) => {
  const isServer = typeof window === "undefined";

  try {
    const {
      responseType,
      body: bodyOpt,
      query,
      authorization = "",
      ...restOpts
    } = opts ?? {};

    const baseURL = resolveApiBaseUrl(service);
    // Ensure no double slashes when joining baseURL and request
    const sanitizedBaseURL = baseURL.endsWith("/")
      ? baseURL.slice(0, -1)
      : baseURL;
    const sanitizedRequest = request.startsWith("/") ? request : `/${request}`;

    const url =
      sanitizedBaseURL +
      sanitizedRequest +
      (query ? `?${qs.stringify(query, { arrayFormat: "repeat" })}` : "");

    const [headers, body] = !bodyOpt
      ? [null, null]
      : bodyOpt instanceof FormData
        ? [null, bodyOpt]
        : [
            {
              "Content-Type": "application/json",
            },
            JSON.stringify(bodyOpt),
          ];

    const response = await fetch(url, {
      headers: {
        ...headers,
        Authorization: authorization,
      },
      body,
      ...restOpts,
    });

    if (!response.ok) {
      const errorText = await response.text();
      if (isServer) {
        console.error(
          `[Server Fetch Error] ${response.status} ${url}: ${errorText}`,
        );
      }
      throw new Error(`API ${response.status} on ${url}: ${errorText}`);
    }

    if (responseType) return response[responseType]() as T;

    const contentType = response.headers.get("Content-Type") ?? "";
    if (contentType.includes("application/json")) {
      return response.json() as T;
    } else if (contentType.includes("image/")) {
      return response.blob() as T;
    } else {
      return response.text() as T;
    }
  } catch (err: any) {
    if (isServer) {
      console.error(
        `[Server Fetch Exception] Service: ${service}: ${err.message || err}`,
      );
    }
    throw err;
  }
};

export const getApiBaseUrl = (service: ApiService) =>
  resolveApiBaseUrl(service);
