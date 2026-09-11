import { defineMiddleware } from "astro/middleware";

import { VERSION_COOKIE_NAME } from "@/utils/cookie";
import { runWithVersionContext } from "@/utils/version";

export const onRequest = defineMiddleware((ctx, next) => {
  const version = ctx.cookies.get(VERSION_COOKIE_NAME)?.value;

  return runWithVersionContext(version, () => next());
});