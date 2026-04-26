# Portal

`portal` — это Telegram mini app-страница с кнопками-переходами в другие миниаппы.

Сейчас проект состоит только из frontend-сервиса:

- без backend
- без базы данных
- без админки
- production-доступ через существующий `gateway`

Production URL:

- `https://portal.etalonfood.com/app`

## Конфиг миниаппов

Названия и ссылки кнопок не захардкожены в коде. Они берутся из runtime-конфига:

- [public/config/apps.json](/home/szeryoga/devel/portal/public/config/apps.json)

Пример:

```json
{
  "title": "Portal",
  "subtitle": "Выберите миниапп, который хотите открыть",
  "apps": [
    {
      "id": "karabas",
      "label": "Karabas",
      "url": "https://t.me/karabas_demo_bot/Karabas_demo"
    }
  ]
}
```

## Переменные окружения

Скопируйте шаблон:

```bash
cp .env.example .env
```

Используются:

```env
APP_DOMAIN=portal.etalonfood.com
APP_BASE_PATH=/app
GATEWAY_NETWORK=gateway-net
```

## Production

Запуск:

```bash
./scripts/prod-up.sh
```

Остановка:

```bash
./scripts/prod-stop.sh
```

После запуска gateway должен маршрутизировать:

- `portal.etalonfood.com/app` -> `http://portal-frontend:80`

## Локальная разработка

Локальный запуск без gateway:

```bash
./scripts/local-dev.sh
```

Локально приложение будет доступно по адресу:

- `http://127.0.0.1:3002/`

Остановка:

```bash
./scripts/local-dev-stop.sh
```
