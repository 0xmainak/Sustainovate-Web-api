# ---- Build Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copy and install dependencies first to leverage Docker's cache
COPY package*.json ./
RUN npm ci

# Copy all source files
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

# ---- Production Stage ----
FROM node:20-alpine AS runner

WORKDIR /app

# Copy both package.json and package-lock.json to the runner stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# This command will now succeed because the lock file is present
RUN npm ci --omit=dev

# Expose the application port
EXPOSE 4000

# Run compiled app
CMD ["node", "dist/index.js"]