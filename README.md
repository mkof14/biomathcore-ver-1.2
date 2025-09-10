# BioMathCore — Quick Start (for Jules)
Clone
git clone git@github.com:mkof14/biomathcore-ver-1.2.git
cd biomathcore-ver-1.2
git pull origin main

Pick DATABASE_URL
export DATABASE_URL=postgres://biomath:biomathpass@db:5432/biomath
# or
# export DATABASE_URL=postgres://biomath:biomathpass@localhost:55432/biomath
# or
# export DATABASE_URL=postgres://biomath:biomathpass@192.168.1.134:55432/biomath

Quick DB check
npx prisma migrate status
# or
docker run --rm -e PGPASSWORD=biomathpass postgres:16 psql -h 192.168.1.134 -p 55432 -U biomath -d biomath -c "SELECT 1;"

Install
corepack enable || true
corepack prepare pnpm@latest --activate || true
pnpm install || npm install
pnpm approve-builds || true
pnpm install || npm install

Prisma
npx prisma generate
npx prisma migrate deploy

Run
pnpm dev || npm run dev

Troubleshooting
printenv DATABASE_URL
export DATABASE_URL=postgres://biomath:biomathpass@db:5432/biomath
npx prisma migrate status
nc -vz 192.168.1.134 55432
npx prisma migrate reset --force
npx prisma migrate deploy
