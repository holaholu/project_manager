# Build stage for React frontend
FROM node:18 AS client-builder
WORKDIR /app/client

# Install dependencies
COPY client/package*.json ./
RUN npm ci

# Build frontend
COPY client/ ./
RUN npm run build

# Build stage for Node.js backend
FROM node:18 AS server-builder
WORKDIR /app/server

# Install dependencies
COPY server/package*.json ./
RUN npm ci

# Build backend
COPY server/ ./
RUN npm run build

# Production stage
FROM node:18-slim
WORKDIR /app

# Copy built client files
COPY --from=client-builder /app/client/build ./client/build

# Copy built server files
COPY --from=server-builder /app/server/dist ./server/dist
COPY --from=server-builder /app/server/package*.json ./server/

# Install production dependencies
WORKDIR /app/server
RUN npm ci --only=production

EXPOSE 5001
CMD ["npm", "start"]
