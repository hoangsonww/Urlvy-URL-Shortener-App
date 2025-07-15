# Dockerfile for Urlvy backend (NestJS API)

### Build Stage
FROM node:18-alpine AS builder
WORKDIR /app

# Copy all source files and install dependencies\COPY . .
RUN npm ci

# Build the NestJS application
RUN npm run build


### Runtime Stage
FROM node:18-alpine AS runner
WORKDIR /app

# Only copy production artifacts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Enforce production mode
ENV NODE_ENV=production

# Expose the API port
EXPOSE 5001

# Start the NestJS server
CMD ["node", "dist/main.js"]
