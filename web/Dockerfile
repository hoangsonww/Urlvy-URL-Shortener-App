# Dockerfile for Urlvy frontend (Next.js PWA)

# 1. Base image
FROM node:18-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

# 2. Install dependencies
# Copy everything so that changes to non-dependency files
# don't bust the cache on npm install.
COPY . .
RUN npm ci --production

# 3. Build the app
RUN npm run build

# 4. Runtime image
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy built artifacts and production deps
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json

# Expose default Next.js port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
