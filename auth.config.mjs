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
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.accessToken = token.accessToken;
      }
      return session;
    },
  },
});
