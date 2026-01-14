export const API_SERVICES = [
  "phenotypeservice",
  "imageservice",
  "ontologyservice",
  "goannotationservice",
  "publicationservice",
  "querypipelineservice",
  "geneservice",
] as const;

export type ApiService = (typeof API_SERVICES)[number];

export type ApiOptions = {
  /**
   * The base url for the api services.
   */
  baseUrl: string;
  /**
   * The version of the api services.
   */
  version: string;
  /**
   * User-defined urls for api services when the app runs in the browser.
   * If a url is not defined for a service, the default value is `${baseUrl}/${service}/${version}`.
   */
  urls?: {
    [key in ApiService]?: string;
  };
  /**
   * User-defined urls for api services when the app runs on the server.
   * If a url is not defined for a service, the default value is the same as the client url, or `http://${service}:8080` in production environment.
   */
  ssrUrls?: {
    [key in ApiService]?: string;
  };
};
