# Dockerfile for Urlvy frontend (Next.js PWA)

### Builder Stage ###
FROM node:18-alpine AS builder
WORKDIR /app

# 1. Install all deps (including dev) for build
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# 2. Copy source & build
COPY . .
RUN npm run build

### Runtime Stage ###
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# 3. Install only production deps, with legacy peer‑deps
COPY package.json package-lock.json ./
RUN npm install --production --legacy-peer-deps

# 4. Copy built output
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# 5. Expose and start
EXPOSE 3000
CMD ["npm", "start"]
