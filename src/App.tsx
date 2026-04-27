import { useEffect, useState } from "react";

import type { PortalConfig } from "./types";
import { openMiniApp, prepareTelegramWebApp } from "./telegram";

function getConfigCandidates() {
  const normalizedBase = import.meta.env.BASE_URL.endsWith("/")
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  const currentPath = window.location.pathname.endsWith("/")
    ? window.location.pathname
    : `${window.location.pathname}/`;

  return [
    `${normalizedBase}config/apps.json`,
    `${currentPath}config/apps.json`,
    "/app/config/apps.json",
    "/config/apps.json",
  ].filter((value, index, values) => values.indexOf(value) === index);
}

function isValidConfig(data: unknown): data is PortalConfig {
  if (!data || typeof data !== "object") {
    return false;
  }

  const candidate = data as Partial<PortalConfig>;

  return (
    typeof candidate.title === "string" &&
    typeof candidate.subtitle === "string" &&
    Array.isArray(candidate.apps) &&
    candidate.apps.every(
      (item) =>
        item &&
        typeof item === "object" &&
        typeof item.id === "string" &&
        typeof item.label === "string" &&
        typeof item.url === "string"
    )
  );
}

async function loadPortalConfig() {
  const configUrls = getConfigCandidates();
  let lastError: Error | null = null;

  for (const configUrl of configUrls) {
    try {
      const response = await fetch(configUrl, { cache: "no-store" });

      if (!response.ok) {
        throw new Error(`Config request failed: ${response.status} at ${configUrl}`);
      }

      const payload: unknown = await response.json();

      if (!isValidConfig(payload)) {
        throw new Error(`Invalid portal config format at ${configUrl}`);
      }

      return payload;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown config error");
    }
  }

  throw lastError ?? new Error("Portal config not found");
}

export default function App() {
  const [config, setConfig] = useState<PortalConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isTelegram = Boolean(window.Telegram?.WebApp);

  useEffect(() => {
    prepareTelegramWebApp();

    async function loadConfig() {
      try {
        const payload = await loadPortalConfig();
        setConfig(payload);
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : "Unknown config error");
      }
    }

    void loadConfig();
  }, []);

  return (
    <main className="portal-shell">
      <div className="portal-orb portal-orb--left" />
      <div className="portal-orb portal-orb--right" />
      <section className="portal-card">
        <p className="portal-kicker">Telegram Mini App</p>
        <h1>{config?.title ?? "Portal"}</h1>
        <p className="portal-subtitle">
          {config?.subtitle ?? "Загрузка конфигурации..."}
        </p>

        {!isTelegram ? (
          <div className="portal-note">
            Открыто вне Telegram. Кнопки ниже все равно работают и откроют нужные ссылки.
          </div>
        ) : null}

        {error ? (
          <div className="portal-error">
            <strong>Не удалось загрузить конфиг.</strong>
            <span>{error}</span>
          </div>
        ) : null}

        <div className="portal-actions">
          {config
            ? config.apps.map((app, index) => (
                <button
                  key={app.id}
                  type="button"
                  className="portal-button"
                  onClick={() => openMiniApp(app.url)}
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  <span className="portal-button__label">{app.label}</span>
                  <span className="portal-button__meta">Открыть миниапп</span>
                </button>
              ))
            : Array.from({ length: 3 }, (_, index) => (
                <div
                  key={`placeholder-${index}`}
                  className="portal-button portal-button--placeholder"
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  <span className="portal-button__label">Загрузка...</span>
                  <span className="portal-button__meta">Подготовка кнопок</span>
                </div>
              ))}
        </div>
      </section>
    </main>
  );
}
