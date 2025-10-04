# Base deps layer
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Development stage (hot reload)
FROM deps AS dev
WORKDIR /app
COPY . .
ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000
CMD ["npm","run","dev"]

# Build stage
FROM deps AS build
WORKDIR /app
COPY . .
RUN npm run build

# Production (static preview server)
FROM node:22-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY package*.json ./
# Install only runtime deps (none needed for plain static preview, keep minimal)
RUN npm install --omit=dev --ignore-scripts || true
EXPOSE 3000
# Use Vite preview (could swap for nginx if desired)
CMD ["npx","vite","preview","--host","0.0.0.0","--port","3000"]

# NOTE:
# docker compose (current) will use the final stage (prod). For dev hot reload add:
#   target: dev
# under the frontend.build section in docker-compose.yml.