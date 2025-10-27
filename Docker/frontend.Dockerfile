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
CMD ["npm", "run", "dev"]

# Build stage
FROM deps AS build
WORKDIR /app
COPY . .
RUN npm run build

# Production stage - static server
FROM node:22-alpine AS prod
WORKDIR /app
COPY --from=build /app/dist ./dist
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
