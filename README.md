# BioMathCore — Quick Start (No Docker)

## Clone
git clone git@github.com:mkof14/biomathcore-ver-1.2.git
cd biomathcore-ver-1.2
git pull origin main

## Database
export DATABASE_URL=postgres://biomath:biomathpass@localhost:5432/biomath
npx prisma generate
npx prisma migrate deploy
npx prisma migrate status

## Run
corepack enable || true
corepack prepare pnpm@latest --activate || true
pnpm install || npm install
pnpm dev || npm run dev
