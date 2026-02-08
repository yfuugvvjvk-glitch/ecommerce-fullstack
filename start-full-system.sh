#!/bin/bash

echo "========================================"
echo "  Pornire sistem complet E-Commerce"
echo "========================================"
echo ""

echo "[1/6] Oprire containere existente..."
docker-compose down
echo ""

echo "[2/6] Pornire PostgreSQL cu Docker..."
docker-compose up -d
echo ""

echo "[3/6] Așteptare pornire PostgreSQL (15 secunde)..."
sleep 15
echo ""

echo "[4/6] Generare Prisma Client..."
cd backend
npm run prisma:generate
echo ""

echo "[5/6] Aplicare migrații Prisma..."
npx prisma migrate deploy
echo ""

echo "[6/6] Inițializare monede..."
node initialize-currencies.js
echo ""

echo "========================================"
echo "  Sistem pregătit! Pornește serverele:"
echo "========================================"
echo ""
echo "  Backend:  cd backend  && npm run dev"
echo "  Frontend: cd frontend && npm run dev"
echo ""
echo "  PostgreSQL: localhost:5432"
echo "  Database:   ecommerce_db"
echo "  User:       postgres"
echo "  Password:   password"
echo ""
