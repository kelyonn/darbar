#!/usr/bin/env bash

if [ -f .dev.pid ]; then
  PID=$(cat .dev.pid)
  echo "Stopping Darbar (PID: $PID)..."
  
  # Kill the process and all its children (pkill -P kills children of PID)
  # npm run dev spawns concurrently, which spawns client and server.
  # We can just kill the process group or use pkill to be safe.
  
  # Kill child processes of the PID first
  pkill -P $PID 2>/dev/null
  
  # Kill the main PID
  kill $PID 2>/dev/null
  
  # Ensure any stray vite or ts-node-dev processes from this project are caught
  pkill -f "concurrently" 2>/dev/null
  pkill -f "vite" 2>/dev/null
  pkill -f "ts-node-dev" 2>/dev/null

  rm .dev.pid
  echo "Darbar stopped."
else
  echo "No .dev.pid file found. Are the servers running?"
  # Clean up just in case
  pkill -f "concurrently" 2>/dev/null
  pkill -f "vite" 2>/dev/null
  pkill -f "ts-node-dev" 2>/dev/null
  echo "Cleaned up any lingering processes."
fi
