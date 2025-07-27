#!/usr/bin/env bash
# Local setup for Urlvy: backend (NestJS + Postgres) & frontend (Next.js)

set -euo pipefail

# 1) Clone the repo (if needed)
REPO_URL="https://github.com/hoangsonww/urlvy.git"
if [ ! -d urlvy ]; then
  echo "Cloning Urlvy…"
  git clone "$REPO_URL"
fi

cd urlvy

# 2) Backend
echo "🏗  Setting up backend…"
cd api
cp .env.example .env
# You’ll need to fill PG_URL, JWT_SECRET, GOOGLE_API_KEY in .env
docker compose up -d postgres
npm install
npm run db-migrate       # run TypeORM migrations
npm run dev &            # start dev server
BACKEND_PID=$!

# 3) Frontend
echo "🏗  Setting up frontend…"
cd ../web
cp .env.local.example .env.local
# Update NEXT_PUBLIC_API if needed (defaults to https://urlvy-url-shortener-app.onrender.com)
npm install
npm run dev &            # start Next.js dev
FRONTEND_PID=$!

# 4) Cleanup on exit
cleanup() {
  echo "Shutting down…"
  kill "$BACKEND_PID" "$FRONTEND_PID"
  cd ../api
  docker compose down
}
trap cleanup EXIT

echo "✅  Local dev environment is up!"
echo "   - Backend: https://urlvy-url-shortener-app.onrender.com/docs"
echo "   - Frontend: http://localhost:3000"
wait
