import type { AsyncLocalStorage } from "node:async_hooks";

import { VERSION_COOKIE_NAME } from "@/utils/cookie";

export type VersionContext = { version?: string };

let versionStorage: AsyncLocalStorage<VersionContext> | undefined;
let versionStoragePromise: Promise<AsyncLocalStorage<VersionContext>> | undefined;

// `AsyncLocalStorage` is Node-only. It's created lazily on the server so this
// module stays evaluable in the client bundle, where `node:async_hooks` is
// externalized for the browser. The lazy path is never triggered on the client.
const getVersionStorage = (): Promise<AsyncLocalStorage<VersionContext>> => {
  if (!versionStoragePromise) {
    versionStoragePromise = import("node:async_hooks").then(
      ({ AsyncLocalStorage }) => {
        versionStorage = new AsyncLocalStorage<VersionContext>();
        return versionStorage;
      },
    );
  }
  return versionStoragePromise;
};

export const getVersionContext = (): VersionContext | undefined =>
  versionStorage?.getStore();

export const runWithVersionContext = async <T>(
  version: string | undefined,
  fn: () => T | Promise<T>,
): Promise<T> => {
  const storage = await getVersionStorage();
  return await storage.run({ version }, fn);
};

export type ResolverOptions = {
  /** Fall back to the default version when none is selected. */
  fallback?: boolean;
};

/**
 * Creates a version resolver that returns the currently selected version
 * (from the SSR-injected cookie context on the server, or `emobase-version`
 * cookie on the client), validated against the given versions list. When
 * `fallback` is set, an unset or invalid selection resolves to the default
 * version instead of `undefined`. The result is memoized per resolver instance.
 */
export const createVersionResolver =
  (
    fetchVersions: () => Promise<{ name: string; isDefault?: boolean }[]>,
    options: ResolverOptions = {},
  ): (() => Promise<string | undefined>) => {
    const { fallback = false } = options;
    let resolvedVersion: Promise<string | undefined> | undefined;
    return (): Promise<string | undefined> => {
      if (!resolvedVersion) {
        resolvedVersion = (async (): Promise<string | undefined> => {
          const store = getVersionContext();
          let cookieVersion: string | undefined;
          if (store) {
            cookieVersion = store.version;
          } else if (typeof document !== "undefined") {
            const match = document.cookie.match(
              new RegExp(`(?:^|; )${VERSION_COOKIE_NAME}=([^;]*)`),
            );
            cookieVersion = match ? decodeURIComponent(match[1]) : undefined;
          }

          let versions: { name: string; isDefault?: boolean }[] | undefined;

          if (cookieVersion) {
            versions = await fetchVersions();
            if (versions.find((v) => v.name === cookieVersion))
              return cookieVersion;
          }

          if (!fallback) return undefined;

          versions ??= await fetchVersions();
          return versions.find((v) => v.isDefault)?.name || versions[0]?.name;
        })();
      }
      return resolvedVersion;
    };
  };