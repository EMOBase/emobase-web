# EMOBase

## 🚀 Project Structure


```text
/
├── public/
│   This is where public assets placed
├── src
│   ├── components
│   ├── layouts
│   └── pages
│       ├── index
│       │   Home page
│       └── search
│           Search result page
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |
| `npm run check`           | Check typescript                                 |

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

## 🏗️ Technical Details
- **Adapter**: `@astrojs/node` in `standalone` mode.
- **Node Version**: 20 (Build) / 20-slim (Runtime).
- **Port**: 8080.
