import { defineMiddleware } from "astro/middleware";

import { runWithVersionContext } from "@/utils/version";

export const onRequest = defineMiddleware((ctx, next) => {
  const version = ctx.cookies.get("emobase-version")?.value;

  return runWithVersionContext(version, () => next());
});