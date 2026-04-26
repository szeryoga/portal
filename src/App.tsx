import { useEffect, useState } from "react";

import type { PortalConfig } from "./types";
import { openMiniApp, prepareTelegramWebApp } from "./telegram";

const CONFIG_URL = `${import.meta.env.BASE_URL}config/apps.json`;

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

export default function App() {
  const [config, setConfig] = useState<PortalConfig | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    prepareTelegramWebApp();

    async function loadConfig() {
      try {
        const response = await fetch(CONFIG_URL, { cache: "no-store" });

        if (!response.ok) {
          throw new Error(`Config request failed: ${response.status}`);
        }

        const payload: unknown = await response.json();

        if (!isValidConfig(payload)) {
          throw new Error("Invalid portal config format");
        }

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

        {error ? (
          <div className="portal-error">
            <strong>Не удалось загрузить конфиг.</strong>
            <span>{error}</span>
          </div>
        ) : null}

        <div className="portal-actions">
          {config?.apps.map((app, index) => (
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
          ))}
        </div>
      </section>
    </main>
  );
}
