#!/usr/bin/env zsh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

GATEWAY_NETWORK_NAME="gateway-net"

if [[ -f .env ]]; then
  GATEWAY_NETWORK_FROM_ENV="$(grep -E '^GATEWAY_NETWORK=' .env | tail -n 1 | cut -d'=' -f2- || true)"
  if [[ -n "${GATEWAY_NETWORK_FROM_ENV}" ]]; then
    GATEWAY_NETWORK_NAME="${GATEWAY_NETWORK_FROM_ENV}"
  fi
fi

if ! docker network inspect "$GATEWAY_NETWORK_NAME" >/dev/null 2>&1; then
  echo "Creating external gateway network: $GATEWAY_NETWORK_NAME"
  docker network create "$GATEWAY_NETWORK_NAME" >/dev/null
fi

docker compose up -d --build frontend

cat <<EOF

Production portal started:
  frontend: portal-frontend:80

Gateway network:
  ${GATEWAY_NETWORK_NAME}

Gateway upstream:
  http://portal-frontend:80
EOF
