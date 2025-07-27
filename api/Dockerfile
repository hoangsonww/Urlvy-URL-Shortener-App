# Dockerfile for Urlvy backend (NestJS API)

### Build Stage
FROM node:18-alpine AS builder
WORKDIR /app

# 1. Copy package manifest and install deps with legacy peer deps
COPY package.json ./
RUN npm install --legacy-peer-deps

# 2. Copy source & build
COPY . .
RUN npm run build

### Runtime Stage
FROM node:18-alpine AS runner
WORKDIR /app

# 3. Copy production artifacts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# 4. Enforce production mode & expose port
ENV NODE_ENV=production
EXPOSE 5001

# 5. Start the server
CMD ["node", "dist/main.js"]
