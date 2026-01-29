import qs from "qs";

import { API_SERVICES, type ApiService } from "./constants/api";

const apiBaseUrl = import.meta.env.PUBLIC_APIS_BASE_URL;

const urls = Object.fromEntries(
  API_SERVICES.map(
    (service) => [service, `${apiBaseUrl}/${service}/v1`] as const,
  ),
);

export const apiFetch = async <T>(
  service: ApiService,
  request: string,
  opts?: Omit<RequestInit, "headers" | "body"> & {
    responseType?: "json" | "text" | "blob" | "formData" | "arrayBuffer";
    body?: any;
    query?: Record<string, string | string[] | null | undefined>;
  },
) => {
  const { responseType = "json", body, query, ...restOpts } = opts ?? {};
  const baseURL = urls[service];
  const url =
    baseURL +
    request +
    (query ? `?${qs.stringify(query, { arrayFormat: "repeat" })}` : "");

  return await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    body: !!body ? JSON.stringify(body) : undefined,
    ...restOpts,
  }).then((response) => response[responseType]() as T);
};

export const getApiBaseUrl = (service: ApiService) => urls[service];
