import Keycloak from "@auth/core/providers/keycloak";
import { defineConfig } from "auth-astro";

const getEnv = (key) => import.meta.env[key] || process.env[key];

export default defineConfig({
  secret: getEnv("AUTH_SECRET"),
  trustHost: getEnv("AUTH_TRUST_HOST"),
  providers: [
    Keycloak({
      clientId: getEnv("KEYCLOAK_CLIENT_ID"),
      clientSecret: getEnv("KEYCLOAK_CLIENT_SECRET"),
      issuer: getEnv("KEYCLOAK_ISSUER"),
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
      // Periodic refresh logic
      if (account) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          expiresAt: account.expires_at * 1000, // Handle seconds to ms
        };
      }

      // If token is still valid, return it
      if (Date.now() < token.expiresAt - 60000) {
        return token;
      }

      // If token is expired or about to expire, refresh it
      try {
        if (!token.refreshToken) {
          console.error("No refresh token available in JWT.");
          throw new Error("MissingRefreshToken");
        }

        console.log("Refreshing access token using refresh_token...");
        const response = await fetch(
          `${getEnv("KEYCLOAK_ISSUER")}/protocol/openid-connect/token`,
          {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              client_id: getEnv("KEYCLOAK_CLIENT_ID"),
              client_secret: getEnv("KEYCLOAK_CLIENT_SECRET"),
              grant_type: "refresh_token",
              refresh_token: token.refreshToken,
            }),
          },
        );

        const tokens = await response.json();

        if (!response.ok) {
          console.error("Keycloak token refresh failed:", tokens);
          throw tokens;
        }

        console.log("Access token refreshed successfully.");
        return {
          ...token,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token ?? token.refreshToken, // Fallback to old refresh token
          expiresAt: Date.now() + tokens.expires_in * 1000,
        };
      } catch (error) {
        console.error("Error refreshing access token:", error);
        return { ...token, error: "RefreshAccessTokenError" };
      }
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.accessToken = token.accessToken;
        session.error = token.error;
      }
      return session;
    },
  },
});
