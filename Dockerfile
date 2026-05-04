FROM node:20-alpine

WORKDIR /app

# Install backend + frontend dependencies first for better layer caching.
COPY backend/package*.json backend/
COPY frontend/package*.json frontend/
RUN npm ci --prefix backend \
  && npm ci --prefix frontend --include=dev

# Copy source
COPY backend backend
COPY frontend frontend

# Build frontend and sync output into backend/dist
RUN npm run build --prefix frontend \
  && node backend/scripts/syncFrontendDist.js

WORKDIR /app/backend
EXPOSE 5000

CMD ["node", "server.js"]
