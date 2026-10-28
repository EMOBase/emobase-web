import { defineMiddleware } from "astro/middleware";

import { VERSION_COOKIE_NAME } from "@/utils/cookie";
import { runWithVersionContext } from "@/utils/version";

export const onRequest = defineMiddleware((ctx, next) => {
  // A shared link can request a temporary view without overwriting the
  // visitor's selected-version cookie. The resolver validates this value
  // against the public READY versions before it is used for data requests.
  const overrideVersion = ctx.url.searchParams.get("version") || undefined;
  const selectedVersion = ctx.cookies.get(VERSION_COOKIE_NAME)?.value;

  return runWithVersionContext({ overrideVersion, selectedVersion }, () =>
    next(),
  );
});
