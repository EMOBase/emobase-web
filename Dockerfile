# Build Stage
FROM node:20 AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Build the project with increased memory for Vite
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build

# Runtime Stage
FROM node:20-slim AS runtime
WORKDIR /app

# Copy built files from the build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

# Environment variables
ENV HOST=0.0.0.0
ENV PORT=8080
EXPOSE 8080

# Start the application
CMD ["node", "./dist/server/entry.mjs"]
