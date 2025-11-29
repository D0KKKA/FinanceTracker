# Build stage
FROM node:20 AS builder

WORKDIR /app

# Copy package files, node_modules, and source
COPY package*.json ./
COPY node_modules ./node_modules
COPY src ./src
COPY tsconfig.json ./
RUN ls tsconfig.build.json >/dev/null 2>&1 || echo "tsconfig.build.json not found"

# Build
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install build dependencies for sqlite3
RUN apk add --no-cache python3 make g++

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --production --legacy-peer-deps || npm install --production --legacy-peer-deps

# Create data directory for SQLite
RUN mkdir -p /app/data

# Expose port
EXPOSE 8000

# Set environment variables
ENV NODE_ENV=production
ENV DATABASE_PATH=/app/data/finance.db

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8000/api/auth/me', (r) => {if (r.statusCode === 401) process.exit(0); else process.exit(1);}).on('error', () => process.exit(1))" || exit 1

# Start the application
CMD ["node", "dist/main"]
