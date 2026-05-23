#!/usr/bin/env bash

echo "Starting Darbar..."

# Check if .env exists, if not create from example
if [ ! -f .env ]; then
  echo "Creating .env from .env.example..."
  cp .env.example .env
  echo "Note: You may need to fill in MONGODB_URI and JWT_ACCESS_SECRET in .env"
fi

# Check if node_modules exists in root, if not run install:all
if [ ! -d "node_modules" ] || [ ! -d "client/node_modules" ] || [ ! -d "server/node_modules" ]; then
  echo "Installing dependencies across the monorepo..."
  npm run install:all
fi

# Run the dev server in the background
echo "Starting development servers (client + server)..."
npm run dev > .dev.log 2>&1 &
PID=$!
echo $PID > .dev.pid

echo "Darbar is running!"
echo "PID: $PID"
echo "Logs are being written to .dev.log"
echo "Client should be available at http://localhost:5173"
echo "Server should be available at http://localhost:5001"
echo "Run ./stop.sh to stop the servers."
