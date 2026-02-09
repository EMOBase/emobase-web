import Keycloak from "@auth/core/providers/keycloak";
import { defineConfig } from "auth-astro";

const getEnv = (key) => import.meta.env[key] || process.env[key];

/**
 * Resolves Keycloak URLs based on the environment.
 * In production, it uses internal container names (like http://keycloak:8080)
 * to ensure faster and more reliable server-to-server communication.
 */
const resolveKeycloakUrls = () => {
  const isServer = typeof window === "undefined";
  const isProd = import.meta.env.PROD || process.env.NODE_ENV === "production";
  const clientUrl = getEnv("KEYCLOAK_CLIENT_URL") || getEnv("KEYCLOAK_ISSUER");

  if (!isServer) return { server: clientUrl, client: clientUrl };

  // Server-side logic
  if (isProd) {
    return {
      server: "http://keycloak:8080/ibb/keycloak/realms/ibb",
      client: clientUrl,
    };
  }

  // Local development fallback
  return { server: clientUrl, client: clientUrl };
};

// In-memory cache to prevent parallel refresh requests for the same token
const refreshCache = new Map();

export default defineConfig({
  secret: getEnv("AUTH_SECRET"),
  // trustHost MUST be a boolean (not a string) for Auth.js to handle redirects correctly
  trustHost: getEnv("AUTH_TRUST_HOST") === "true",
  providers: [
    Keycloak({
      clientId: getEnv("KEYCLOAK_CLIENT_ID"),
      clientSecret: getEnv("KEYCLOAK_CLIENT_SECRET"),
      issuer: getEnv("KEYCLOAK_VALID_ISSUER") || getEnv("KEYCLOAK_ISSUER"),

      // Explicitly define endpoints to handle Docker networking
      authorization: {
        url: `${resolveKeycloakUrls().client}/protocol/openid-connect/auth`,
        params: { scope: "openid email profile offline_access" },
      },
      token: `${resolveKeycloakUrls().server}/protocol/openid-connect/token`,
      userinfo: `${resolveKeycloakUrls().server}/protocol/openid-connect/userinfo`,
      jwks_endpoint: `${resolveKeycloakUrls().server}/protocol/openid-connect/certs`,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          expiresAt: account.expires_at * 1000,
        };
      }

      if (Date.now() < token.expiresAt - 60000) {
        return token;
      }

      const refreshToken = token.refreshToken;
      if (!refreshToken) return { ...token, error: "MissingRefreshToken" };
      if (refreshCache.has(refreshToken)) return refreshCache.get(refreshToken);

      const refreshPromise = (async () => {
        try {
          const { server: issuer } = resolveKeycloakUrls();
          const response = await fetch(
            `${issuer}/protocol/openid-connect/token`,
            {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: new URLSearchParams({
                client_id: getEnv("KEYCLOAK_CLIENT_ID"),
                client_secret: getEnv("KEYCLOAK_CLIENT_SECRET"),
                grant_type: "refresh_token",
                refresh_token: refreshToken,
              }),
            },
          );

          const tokens = await response.json();
          if (!response.ok) throw tokens;

          return {
            ...token,
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token ?? refreshToken,
            expiresAt: Date.now() + tokens.expires_in * 1000,
            error: null,
          };
        } catch (error) {
          return { ...token, error: "RefreshAccessTokenError" };
        } finally {
          setTimeout(() => refreshCache.delete(refreshToken), 10000);
        }
      })();

      refreshCache.set(refreshToken, refreshPromise);
      return refreshPromise;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.accessToken = token.accessToken;
        if (token.expiresAt) {
          session.expires = new Date(token.expiresAt).toISOString();
        }
        session.error = token.error;
      }
      return session;
    },
  },
});
