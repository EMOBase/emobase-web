# EMOBase species web UI

Astro server-rendered frontend for one species site in EMOBase. It renders
Directus-managed content and links to the portal's genomics API, JBrowse2 and
BLAST for the species' data.

The image is published as `ghcr.io/emobase/emobase-web` and deployed by
[`emobase-deploy`](https://github.com/EMOBase/emobase-deploy).

- [Species deployment](https://github.com/EMOBase/emobase-deploy/tree/dev)
- [Portal deployment](https://github.com/EMOBase/emobase-portal-deploy)
- [Deployment guide](https://github.com/EMOBase/emobase-docs/blob/main/DEPLOYMENT.md)

## Requirements

- Node.js 22+ and npm
- A running species stack, or local Directus, genomics API and Keycloak
  endpoints for the data-backed pages

## Local development

```bash
npm install
cp .env.example .env
# Set PUBLIC_SERVER and the API, Keycloak and Directus URLs.

npm run dev
```

The dev server listens on `http://localhost:4321`. To connect it to a running
local Docker stack, including the `.env` values and the Keycloak dev origin,
see [DEVELOPMENT.md](DEVELOPMENT.md). `npm run check` type-checks the project
and `npm run build` produces the production build.

## Project structure

```text
src/
├── astros/      Server-only Astro components
├── components/  React components (common, form, layouts, pages, ui)
├── hooks/       Custom React hooks
├── layouts/     Project layouts
├── pages/       Route handlers
├── states/      State management
├── styles/      Global CSS
└── utils/       Helper functions and API clients
astro.config.mjs   Astro configuration
auth.config.mjs    Auth.js/Keycloak configuration
Dockerfile         Production image
```

## Deployment

Deploy through [`emobase-deploy`](https://github.com/EMOBase/emobase-deploy/tree/dev):
it runs the species nginx, proxies Directus at `/ibb/directus` and connects the
site to the shared infrastructure. Do not add a separate compose/nginx setup
for this repository.

## Development tasks

See [DEVELOPMENT.md](DEVELOPMENT.md) for connecting the dev server to the local
Docker stack, regenerating the icon data and the Directus schema types.
