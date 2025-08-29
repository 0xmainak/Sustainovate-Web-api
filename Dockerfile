# ---- Build Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copy and install dependencies first to leverage Docker's cache
COPY package*.json ./
RUN npm ci

# Copy all source files for the build
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

# ---- Production Stage ----
FROM node:20-alpine AS runner

WORKDIR /app

# Copy necessary files from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/dist ./dist

# Prune development dependencies and copy production-only node_modules
RUN npm ci --omit=dev

# Expose the application port
EXPOSE 4000

# Healthcheck to monitor container status
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD ["node", "-e", "fetch('http://localhost:4000/').then(res => res.status === 200 ? process.exit(0) : process.exit(1))"]

# Run compiled app
CMD ["node", "dist/index.js"]