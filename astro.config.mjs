// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import authAstro from "@zitadel/astro-auth";

import tailwindcss from "@tailwindcss/vite";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [
    react(),
    authAstro({ configFile: "./auth.config.mjs", injectEndpoints: false }),
  ],

  // Deployments run on arbitrary hostnames (VM names, temporary test domains),
  // and this image is built once. An allowlist is build-time, so it cannot name
  // them all; an unlisted Host makes Astro replace the request origin with
  // localhost, which breaks OAuth redirects and absolute links.
  //
  // Trust any Host instead. This is only safe because emobase-deploy puts the
  // species nginx in front: it serves a single server_name (PUBLIC_HOST), sends
  // every other Host to a default server that returns 444, and overwrites
  // X-Forwarded-Host with the host it accepted. The app port is loopback-only,
  // so there is no path to the app that skips that proxy. Never publish the app
  // port or remove the nginx host check while this is `[{}]`.
  security: {
    checkOrigin: process.env.DISABLE_ORIGIN_CHECK !== "true",
    allowedDomains: [{}],
  },

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: [
        "@jbrowse/core",
        "@jbrowse/embedded-core",
        "@jbrowse/jexl",
        "@jbrowse/mobx-state-tree",
        "@jbrowse/plugin-alignments",
        "@jbrowse/plugin-arc",
        "@jbrowse/plugin-authentication",
        "@jbrowse/plugin-bed",
        "@jbrowse/plugin-canvas",
        "@jbrowse/plugin-circular-view",
        "@jbrowse/plugin-config",
        "@jbrowse/plugin-data-management",
        "@jbrowse/plugin-gccontent",
        "@jbrowse/plugin-gff3",
        "@jbrowse/plugin-legacy-jbrowse",
        "@jbrowse/plugin-linear-genome-view",
        "@jbrowse/plugin-sequence",
        "@jbrowse/plugin-trix",
        "@jbrowse/plugin-variants",
        "@jbrowse/plugin-wiggle",
        "@jbrowse/product-core",
        "@jbrowse/quick-lru",
        "@jbrowse/react-linear-genome-view2",
        "@jbrowse/sv-core",
      ],
      include: [
        "@babel/runtime/helpers/extends",
        "copy-to-clipboard",
        "deepmerge",
        "detect-node",
        "escape-html",
        "fast-deep-equal",
        "hoist-non-react-statics",
        "load-script",
        "pluralize",
        "prop-types",
        "react-draggable",
        "react-is",
        "set-value",
        "source-map-js",
        "use-sync-external-store",
        "use-sync-external-store/shim",
        "use-sync-external-store/shim/with-selector",
      ],
    },
  },

  adapter: node({
    mode: "standalone",
  }),

  server: {
    host: true, // Listen on 0.0.0.0 for container networks
  },
});
