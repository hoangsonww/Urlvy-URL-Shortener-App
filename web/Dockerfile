# Dockerfile for Urlvy frontend (Next.js PWA)

### Base / Install Stage
FROM node:18-alpine AS base
WORKDIR /app

# 1. Copy package manifest & install only prod deps
COPY package.json package-lock.json ./
RUN npm install --production --legacy-peer-deps

# 2. Copy rest & build the Next.js app
COPY . .
RUN npm run build

### Runtime Stage
FROM node:18-alpine AS runner
WORKDIR /app

# 3. Copy built output and prod deps
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json

# 4. Set production env & expose port
ENV NODE_ENV=production
EXPOSE 3000

# 5. Start the PWA
CMD ["npm", "start"]
