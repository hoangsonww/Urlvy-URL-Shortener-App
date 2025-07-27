# Dockerfile for Urlvy frontend (Next.js PWA)

### Builder Stage
FROM node:18-alpine AS builder
WORKDIR /app

# 1. Copy package manifests & install all deps (including dev for build)
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# 2. Copy source & build
COPY . .
RUN npm run build

# 3. Remove devDependencies to slim down
RUN npm prune --production

### Runtime Stage
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# 4. Copy built output and production deps
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# 5. Expose port and start
EXPOSE 3000
CMD ["npm", "start"]
