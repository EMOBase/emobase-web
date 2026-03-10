# EMOBase Web Frontend

## 🚀 Project Structure


```text
/
├── public/          # Static assets
├── src/
│   ├── astros/      # Server-only Astro components
│   ├── components/  # React components
│   │   ├── common/  # Shared components
│   │   ├── form/    # Form components (Tanstack Form compatible)
│   │   ├── layouts/ # Components for layouts
│   │   ├── pages/   # Page-specific components
│   │   └── ui/      # Core UI primitives
│   ├── hooks/       # Custom React hooks
│   ├── layouts/     # Project layouts
│   ├── pages/       # Route handlers
│   ├── states/      # State management
│   ├── styles/      # Global CSS
│   └── utils/       # Helper functions
├── astro.config.mjs # Astro configuration
├── auth.config.mjs  # Auth.js/Keycloak configuration
├── Dockerfile       # Production build definition
└── package.json     # Dependencies & Scripts
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 💻 Local Development

Instructions for setting up and running the project locally on your machine:

1. **Prerequisites**: Ensure you have [Node.js 20+](https://nodejs.org/) installed.
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Environment Setup**: Copy the example environment file and update it with your local settings.
   ```bash
   cp .env.example .env
   ```
4. **Start Developing**:
   ```bash
   npm run dev
   ```
   The site will be available at `http://localhost:4321`.

## 🐳 Docker Deployment

### 1. Docker Compose Integration

To deploy this service alongside other components, include it in your `compose.yml`.

```yaml
services:
  emobase-web:
    # Build from source
    build: ./path/to/emobase-web # Update context path as needed
    # Or use pre-built image
    # image: your-registry/emobase-web:latest
    restart: always
    environment:
      - PUBLIC_APIS_BASE_URL=https://api.example.com/api
      - PUBLIC_UI_PAGE_GENOMEBROWSER=https://genome.example.com/jbrowse2/
      - AUTH_SECRET=your_secret_here
      # ... other environment variables
    # Alternatively, use an env_file
    # env_file:
    #   - .env
```

### 2. Nginx Configuration

When deploying behind Nginx, ensure you pass the correct headers so that the application can correctly handle redirects and authentication callbacks.

Sample Nginx configuration:

```nginx
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://emobase-web:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Important for WebSocket support (if needed)
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### 3. Technical Details
- **Adapter**: `@astrojs/node` in `standalone` mode.
- **Ports**: Listens on port `8080` by default.
- **Base Image**: `node:20` (Build) / `node:20-slim` (Runtime).

---

## 🛠 Directus Schema Synchronization

The project uses TypeScript types derived directly from the Directus data model. When you change the schema in Directus, follow these steps to update the types:

### 1. Obtain an Access Token
Run the following command to log in as admin and get an `access_token`:

```bash
curl -X POST http://localhost:9090/ibb/cms/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "admin"}'
```

### 2. Regenerate Types
Use the `directus-sdk-typegen` tool with the token obtained above:

```bash
npx directus-sdk-typegen \
  -u http://localhost:9090/ibb/cms \
  -o src/utils/directus-schema.ts \
  -t [YOUR_ACCESS_TOKEN]
```

This will update `src/utils/directus-schema.ts`, ensuring full type safety and auto-completion for your Directus collections.
