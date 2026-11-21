# Development

## Run against the local Docker stack

Set up the stack first with the
[local development guide](https://github.com/EMOBase/emobase-docs/blob/main/DEVELOPMENT.md).
It starts the species site at `http://localhost:9090`, the portal at
`http://localhost:9080` and Keycloak at `http://localhost:8181/keycloak`.

The dev server runs on the host, so keep `PUBLIC_SERVER` as the dev origin for
auth, and point the browser-facing URLs at the Docker stack:

```dotenv
PUBLIC_SERVER=http://localhost:4321
PUBLIC_MAIN_SPECIES=Tcas

PUBLIC_APIS_BASE_URL=http://localhost:9090/ibb/api
PUBLIC_API_GENOMICS_SERVICE=http://localhost:9080/api/genomicsservice/v1
PUBLIC_UI_PAGE_GENOMEBROWSER=http://localhost:9080/jbrowse/
PUBLIC_UI_PAGE_BLAST=http://localhost:9090/blast/
PUBLIC_UI_PAGE_ONTOSCOPE=http://localhost:9090/ibb/ontoscope
PUBLIC_UI_PAGE_API_DOC=http://localhost:9090/ibb/swagger-ui/
PUBLIC_DIRECTUS_URL=http://localhost:9090/ibb/directus

AUTH_SECRET=<species SSR_OIDC_SESSION_SECRET>
AUTH_TRUST_HOST=true

KEYCLOAK_ISSUER=http://localhost:8181/keycloak/realms/<species realm>
KEYCLOAK_CLIENT_ID=<species client ID>
KEYCLOAK_CLIENT_SECRET=<species client secret>
```

Read those values from the species checkout's `.env`:

```bash
grep -E '^(SSR_OIDC_SESSION_SECRET|KEYCLOAK_REALM|KEYCLOAK_CLIENT_ID|KEYCLOAK_CLIENT_SECRET|MAIN_SPECIES)=' Tcas/.env
```

Leave `INTERNAL_*` unset for host-side development: they fall back to the
absolute `PUBLIC_*` URLs above, which the host can reach.

`localhost` is outside `security.allowedDomains`, so start the dev server with
the origin check disabled:

```bash
DISABLE_ORIGIN_CHECK=true npm run dev
```

Add the dev origin to the species Keycloak client once, so login redirects back
to the dev server:

```bash
cd infra
./scripts/allow-origin.sh \
  --realm <species realm> \
  --client-id <species client ID> \
  http://localhost:4321
```

If the species joined the portal realm, this is the portal client; add the
origin there instead. If you run this and the portal dev server at the same
time, give one of them a second port (for example `4322`) and add that origin
too.

If login still redirects to the Docker site, set
`AUTH_URL=http://localhost:4321` in `.env`.

BLAST submits through a first-party CSRF cookie, so a search started from the
`4321` dev origin may be rejected. Use the Docker species site's `/blast/` for
BLAST testing; the other APIs work from the dev server.

If a browser API call is blocked by CORS, check the service's CORS settings:
the deployed UI is same-origin, while the dev server is not.

## Icon data regeneration

The `<Icon />` component (`src/components/ui/icon.tsx`) renders Material
Symbols from SVG path data stored in `src/utils/constants/icon.ts`. Run this
after updating the `@material-symbols/svg-*` packages or adding an icon:

```bash
node scripts/generate-icon-data.mjs
```

For a new icon, add its base name to the `ICON_NAMES` array in
`scripts/generate-icon-data.mjs` first, then rerun. The script generates the
outlined and fill variants for every weight; use the base name (for example
`home` for `<Icon name="home" fill />`).

## Directus schema types

`src/utils/directus-schema.ts` is generated from the Directus data model.
After changing the schema in Directus, log in as admin and regenerate it.

Get an access token with the `DIRECTUS_ADMIN_EMAIL` and
`DIRECTUS_ADMIN_PASSWORD` from the species checkout's `.env`:

```bash
curl -X POST "http://localhost:9090/ibb/directus/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "<DIRECTUS_ADMIN_EMAIL>", "password": "<DIRECTUS_ADMIN_PASSWORD>"}'
```

Then regenerate the types:

```bash
npx directus-sdk-typegen \
  -u http://localhost:9090/ibb/directus \
  -o src/utils/directus-schema.ts \
  -t [YOUR_ACCESS_TOKEN]
```

For a deployed site, use its public URL and the same `/ibb/directus` prefix.

## Checks

- `npm run check` type-checks the project.
- `npm run build` produces the production build.
