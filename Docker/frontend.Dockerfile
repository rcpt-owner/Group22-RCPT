FROM node:22-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY rcpt/package*.json ./
RUN npm ci --silent

# Copy the rest of the React app
COPY rcpt/ ./

# Expose the dev server port and set environment defaults
ENV PORT=3000
ENV HOST=0.0.0.0
ENV CHOKIDAR_USEPOLLING=true

# Exposes container port 3000 for Docker networking.
EXPOSE 3000

# Start the React development server
CMD ["npm", "run", "dev"]