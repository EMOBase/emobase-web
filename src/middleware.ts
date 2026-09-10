import { defineMiddleware } from "astro/middleware";

import { parseCookies } from "@/utils/cookie";
import { runWithVersionContext } from "@/utils/version";

export const onRequest = defineMiddleware((ctx, next) => {
  const cookies = parseCookies(ctx.request.headers.get("Cookie"));
  const version = cookies["emobase-version"];

  return runWithVersionContext(version, () => next());
});