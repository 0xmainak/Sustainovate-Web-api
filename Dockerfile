# ---- Build Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json ./

# Use npm install here to avoid lockfile mismatch errors
RUN npm install

# Copy all source files
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

# ---- Production Stage ----
FROM node:20-alpine AS runner

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Expose the application port
EXPOSE 4000

# Run compiled app
CMD ["node", "dist/index.js"]
