#!/usr/bin/env zsh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

COMPOSE_FILES=(-f docker-compose.yml -f docker-compose.local.yml)

echo "Building and starting local portal frontend..."
docker compose "${COMPOSE_FILES[@]}" up -d --build frontend

cat <<'EOF'

Local portal is available at:
  http://127.0.0.1:3002/

Useful commands:
  docker compose -f docker-compose.yml -f docker-compose.local.yml logs -f frontend
EOF
