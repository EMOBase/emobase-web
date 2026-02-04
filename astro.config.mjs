// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import auth from "auth-astro";

import tailwindcss from "@tailwindcss/vite";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), auth()],

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: node({
    mode: "standalone",
  }),

  server: {
    host: true, // Listen on 0.0.0.0 for container networks
  },
});
