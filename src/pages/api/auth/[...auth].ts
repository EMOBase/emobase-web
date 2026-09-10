import { Auth } from "@auth/core";
import { decode } from "@auth/core/jwt";
import authConfig from "../../../../auth.config.mjs";
import { getEnv } from "@/utils/env";

const SESSION_COOKIE = "__Secure-authjs.session-token";
const SIGNOUT_PATH = "/api/auth/signout";

const handler = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  url.protocol = "https:";

  if (url.pathname === SIGNOUT_PATH && request.method === "POST") {
    const idToken = await getIdToken(request);
    const response = await Auth(new Request(url, request), authConfig);

    if (idToken) {
      const logoutUrl = new URL(
        `${getEnv("KEYCLOAK_ISSUER")}/protocol/openid-connect/logout`,
      );
      logoutUrl.searchParams.set("post_logout_redirect_uri", url.origin);
      logoutUrl.searchParams.set("id_token_hint", idToken);

      const res = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });
      res.headers.set("Location", logoutUrl.toString());
      return res;
    }

    return response;
  }

  return await Auth(new Request(url, request), authConfig);
};

async function getIdToken(request: Request): Promise<string | null> {
  const cookie = request.headers.get("cookie") ?? "";
  const value = cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${SESSION_COOKIE}=`))
    ?.slice(SESSION_COOKIE.length + 1);

  if (!value) return null;

  try {
    const token = await decode({
      token: value,
      secret: authConfig.secret as string,
      salt: SESSION_COOKIE,
    });
    return typeof token?.idToken === "string" ? token.idToken : null;
  } catch {
    return null;
  }
}

export const GET = handler;
export const POST = handler;
