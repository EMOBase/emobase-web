import qs from "qs";

import { type ApiService } from "./constants/api";

/**
 * Resolves the base URL for a given service.
 * In production, this uses internal container names to allow the Astro server
 * to talk directly to backend services within the same Docker network.
 * - Production: http://service:8080/...
 * - Development/Client: Uses the public base URL
 */
export const resolveApiBaseUrl = (service: ApiService) => {
  const isServer = typeof window === "undefined";
  const env = import.meta.env;

  // Client side always uses the public URL
  if (!isServer) {
    return `${env.PUBLIC_APIS_BASE_URL}/${service}/v1`;
  }

  // Server-side logic
  // Automatic service discovery only in production
  if (env.PROD) {
    return `http://${service}:8080/${service}/v1`;
  }

  // Local development fallback
  return `${env.PUBLIC_APIS_BASE_URL}/${service}/v1`;
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
  const {
    responseType,
    body: bodyOpt,
    query,
    authorization = "",
    ...restOpts
  } = opts ?? {};

  const baseURL = resolveApiBaseUrl(service);
  const url =
    baseURL +
    request +
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
    const error = await response.text();
    throw new Error(error);
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
};

export const getApiBaseUrl = (service: ApiService) =>
  resolveApiBaseUrl(service);
