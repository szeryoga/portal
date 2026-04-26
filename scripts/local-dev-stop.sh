#!/usr/bin/env zsh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

COMPOSE_FILES=(-f docker-compose.yml -f docker-compose.local.yml)

docker compose "${COMPOSE_FILES[@]}" stop frontend

cat <<'EOF'

Local portal frontend stopped.
EOF
