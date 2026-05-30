# Архитектура Poputi

- `frontend` — Telegram Mini App и browser SPA под `/app`
- `admin` — админка под `/admin`
- `backend` — FastAPI API под `/api`
- `postgres` — основная БД
- `nginx` — локальный reverse proxy, имитирующий внешний gateway

Локально:
- `http://127.0.0.1:3014/app`
- `http://127.0.0.1:3014/admin`
- `http://127.0.0.1:3014/api`

На проде:
- `gateway` маршрутизирует `/app`, `/admin`, `/api` в `poputi-frontend`, `poputi-admin`, `poputi-backend`.
