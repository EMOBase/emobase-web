import { defineMiddleware } from "astro/middleware";

import { parseCookies } from "@/utils/cookie";
import { versionStorage } from "@/utils/services/genomics";

export const onRequest = defineMiddleware((ctx, next) => {
  const cookies = parseCookies(ctx.request.headers.get("Cookie"));
  const version = cookies["emobase-version"];

  return versionStorage.run({ version }, () => next());
});
