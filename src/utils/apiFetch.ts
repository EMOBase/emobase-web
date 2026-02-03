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
  const {
    responseType = "json",
    body: bodyOpt,
    query,
    ...restOpts
  } = opts ?? {};
  const baseURL = urls[service];
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
    },
    body,
    ...restOpts,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return response[responseType]() as T;
};

export const getApiBaseUrl = (service: ApiService) => urls[service];
