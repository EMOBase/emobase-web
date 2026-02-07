import Keycloak from "@auth/core/providers/keycloak";
import { defineConfig } from "auth-astro";

const getEnv = (key) => import.meta.env[key] || process.env[key];

// In-memory cache to prevent parallel refresh requests for the same token
const refreshCache = new Map();

export default defineConfig({
  secret: getEnv("AUTH_SECRET"),
  trustHost: getEnv("AUTH_TRUST_HOST"),
  providers: [
    Keycloak({
      clientId: getEnv("KEYCLOAK_CLIENT_ID"),
      clientSecret: getEnv("KEYCLOAK_CLIENT_SECRET"),
      issuer: getEnv("KEYCLOAK_ISSUER"),
      authorization: {
        params: { scope: "openid email profile offline_access" },
      },
      // Override internal endpoints because Keycloak is returning 'keycloak:8080'
      // which is not resolvable from the host.
      token: `${getEnv("KEYCLOAK_ISSUER")}/protocol/openid-connect/token`,
      userinfo: `${getEnv("KEYCLOAK_ISSUER")}/protocol/openid-connect/userinfo`,
      jwks_endpoint: `${getEnv("KEYCLOAK_ISSUER")}/protocol/openid-connect/certs`,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account }) {
      // First login
      if (account) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          expiresAt: account.expires_at * 1000,
        };
      }

      // If token is still valid, return it
      if (Date.now() < token.expiresAt - 60000) {
        return token;
      }

      const refreshToken = token.refreshToken;
      if (!refreshToken) {
        return { ...token, error: "MissingRefreshToken" };
      }

      // If a refresh is already in progress for this token, wait for it
      if (refreshCache.has(refreshToken)) {
        return refreshCache.get(refreshToken);
      }

      // Create a new refresh promise
      const refreshPromise = (async () => {
        try {
          const response = await fetch(
            `${getEnv("KEYCLOAK_ISSUER")}/protocol/openid-connect/token`,
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

          if (!response.ok) {
            throw tokens;
          }

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
          // Cleanup cache after some time to avoid memory leaks
          setTimeout(() => refreshCache.delete(refreshToken), 10000);
        }
      })();

      refreshCache.set(refreshToken, refreshPromise);
      return refreshPromise;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.accessToken = token.accessToken;
        // Map the real Keycloak expiration to session.expires so the client hook uses the correct time
        if (token.expiresAt) {
          session.expires = new Date(token.expiresAt).toISOString();
        }
        session.error = token.error;
      }
      return session;
    },
  },
});
