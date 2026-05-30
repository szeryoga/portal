# Poputi

`poputi` — миниапп магазина «По пути» с каталогом товаров, событиями, корзиной, оформлением заказа, админкой и backend API.

## Сервисы

- `frontend` — Telegram Mini App / browser SPA
- `admin` — админка магазина
- `backend` — FastAPI API
- `postgres` — PostgreSQL
- `nginx` — локальный reverse proxy для разработки

## Быстрый старт

```bash
cp .env.example .env
./scripts/local-dev.sh
```

Локальные адреса:

- mini app: `http://127.0.0.1:3014/app`
- admin: `http://127.0.0.1:3014/admin`
- api: `http://127.0.0.1:3014/api/`
- health: `http://127.0.0.1:3014/health`
- docs: `http://127.0.0.1:8014/docs`

## Тесты

Минимальная API test-infra запускается из отдельного docker-контейнера `tests`.

Тесты против `backend`:

```bash
./scripts/local-tests.sh backend
```

Тесты против локального `nginx`:

```bash
./scripts/local-tests.sh nginx
```

Что сейчас входит:

- `tests/create-order.sh` — smoke/integration тест на создание заказа через public API
- `tests/run-all.sh` — общий runner для запуска всех API-тестов

По умолчанию тесты ходят:

- либо в `http://backend:8000/api/public`
- либо в `http://nginx/api/public`

То есть можно отдельно тестировать:

- бизнес-логику API без proxy-слоя
- и integration path через локальный nginx с путями `/api`

## Production

```bash
./scripts/prod-up.sh
```

Production URLs:

- mini app: `https://poputi.appline.tw1.ru/app`
- admin: `https://poputi.appline.tw1.ru/admin`
- api: `https://poputi.appline.tw1.ru/api`

Сервисы для `gateway`:

- `poputi-frontend:80`
- `poputi-admin:80`
- `poputi-backend:8000`

## Environment

Основные группы переменных:

- Postgres
- admin auth / JWT
- S3 storage для изображений товаров и событий
- СБП-платежи
- Google Client ID для браузерной авторизации

## Что уже реализовано

- backend на FastAPI + SQLAlchemy + Alembic
- сид данных магазина, категорий, товаров, событий и соцсетей
- модели клиентов, заказов, позиций заказа и webhook логов оплаты
- публичные API для bootstrap, auth, профиля, заказа и webhook оплаты
- admin API для настроек, товаров, категорий, событий, заказов, клиентов и загрузки изображений в S3
- docker-compose и локальный nginx по схеме проектов `quiz10` / `tochka`

## Следующие действия после генерации проекта

1. Заполнить `.env`
2. Поднять локальный стек
3. Проверить frontend и admin
4. Подключить production route в `gateway`
