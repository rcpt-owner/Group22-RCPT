FROM node:18-alpine

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

EXPOSE 3000

CMD ["npm", "start"]
