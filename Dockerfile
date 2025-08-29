# ---- Build Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copy and install dependencies first to leverage Docker's cache
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

# ---- Production Stage ----
FROM node:20-alpine AS runner

WORKDIR /app

# Copy only the package.json and the built files to the runner stage
COPY --from=builder /app/package.json ./
COPY --from=builder /app/dist ./dist

# Copy node_modules from the builder stage
COPY --from=builder /app/node_modules ./node_modules

# Expose the application port
EXPOSE 4000

# Run compiled app
CMD ["node", "dist/index.js"]