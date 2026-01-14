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
  opts?: Parameters<typeof fetch>[1],
) => {
  const baseURL = urls[service];
  const url = baseURL + request;

  return await fetch(url, { ...opts }).then((response) => response.json() as T);
};

export const getApiBaseUrl = (service: ApiService) => urls[service];
