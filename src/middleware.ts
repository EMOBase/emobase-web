import { defineMiddleware } from "astro/middleware";

import { VERSION_COOKIE_NAME } from "@/utils/cookie";
import genomicsService from "@/utils/services/genomics";
import { runWithVersionContext } from "@/utils/version";

const shouldSkipVersionCleanup = (pathname: string) =>
  pathname.startsWith("/api") ||
  pathname.startsWith("/_astro") ||
  pathname.startsWith("/assets") ||
  pathname.includes("."); // Check for files with extension, e.g. favicon.ico, logo.png, .etc

export const onRequest = defineMiddleware(async (ctx, next) => {
  // A shared link can request a temporary view without overwriting the
  // visitor's selected-version cookie. The resolver validates this value
  // against the public READY versions before it is used for data requests.
  const rawOverride = ctx.url.searchParams.get("version");
  const selectedVersion = ctx.cookies.get(VERSION_COOKIE_NAME)?.value;
  let overrideVersion: string | undefined = undefined;

  if (rawOverride !== null && !shouldSkipVersionCleanup(ctx.url.pathname)) {
    const trimmed = rawOverride.trim();
    if (trimmed === "") {
      const url = new URL(ctx.url);
      url.searchParams.delete("version");
      return ctx.redirect(`${url.pathname}${url.search}${url.hash}`, 302);
    }

    try {
      const { fetchPublicVersions } = genomicsService();
      const versions = await fetchPublicVersions();
      const isValid = versions.some(
        (v) => v.name === trimmed && v.status === "READY",
      );
      if (!isValid) {
        const url = new URL(ctx.url);
        url.searchParams.delete("version");
        return ctx.redirect(`${url.pathname}${url.search}${url.hash}`, 302);
      }
      overrideVersion = trimmed;
    } catch {
      // If versions cannot be fetched, let the resolver handle validation.
      overrideVersion = trimmed || undefined;
    }
  } else if (rawOverride !== null) {
    const trimmed = rawOverride.trim();
    overrideVersion = trimmed || undefined;
  }

  return runWithVersionContext({ overrideVersion, selectedVersion }, () =>
    next(),
  );
});
