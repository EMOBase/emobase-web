# EMOBase

## 🚀 Project Structure


```text
/
├── public/          # Static assets
├── src/
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

## 🛠️ Getting Started

Follow these steps to set up your local development environment:

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

### 1. Environment Configuration
Ensure you have a `.env` file in the root directory. You can use `.env.example` as a template:
```bash
cp .env.example .env
# Edit .env with your actual values
```

### 2. Usage with Docker Compose
To deploy this service alongside other components, include it in your production Docker Compose stack. It will automatically talk to other services (like `geneservice` and `keycloak`) using their service names.

```yaml
services:
  emobase-web:
    build:
      context: .
    env_file:
      - .env
    restart: always
```

### 3. Technical Details
- **Adapter**: `@astrojs/node` in `standalone` mode.
- **Node Version**: 20 (Build) / 20-slim (Runtime).
- **Port**: 8080.
