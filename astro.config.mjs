// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import auth from "auth-astro";

import tailwindcss from "@tailwindcss/vite";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [react(), auth()],

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
