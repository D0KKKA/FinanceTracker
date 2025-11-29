# Build stage - use full Node image to avoid SWC issues
FROM node:20 AS builder

WORKDIR /app

# Copy package files and source
COPY package*.json ./
COPY next.config.mjs tsconfig.json postcss.config.mjs ./
COPY public ./public
COPY app ./app
COPY components ./components
COPY lib ./lib
COPY hooks ./hooks
COPY context ./context

# Install dependencies and build
RUN npm ci --legacy-peer-deps && npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --production --legacy-peer-deps || npm install --production --legacy-peer-deps

# Copy built application and public files from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=http://backend:8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000 || exit 1

# Start the application
CMD ["npm", "start"]
