# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Backend & Final Image
FROM node:20-alpine
WORKDIR /app

# Copy backend dependencies
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install --omit=dev

# Copy backend source
COPY backend/ ./

# Copy built frontend dist from Stage 1 into backend's range
COPY --from=frontend-builder /app/frontend/dist ../frontend/dist

# Ensure database directory exists
RUN mkdir -p database

# Default Env (should be overridden during run)
ENV PORT=3003
ENV NODE_ENV=production

EXPOSE 3003

# Start the unified server
CMD ["node", "server.js"]
