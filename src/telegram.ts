declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready?: () => void;
        expand?: () => void;
        requestFullscreen?: () => void;
        openLink?: (url: string) => void;
        openTelegramLink?: (url: string) => void;
        viewportHeight?: number;
        viewportStableHeight?: number;
        onEvent?: (eventType: string, eventHandler: () => void) => void;
      };
    };
  }
}

function updateViewportHeight() {
  const webApp = window.Telegram?.WebApp;
  const viewportHeight = webApp?.viewportStableHeight || webApp?.viewportHeight;

  if (viewportHeight && Number.isFinite(viewportHeight)) {
    document.documentElement.style.setProperty("--tg-viewport-height", `${viewportHeight}px`);
  }
}

export function prepareTelegramWebApp() {
  const webApp = window.Telegram?.WebApp;

  webApp?.ready?.();
  webApp?.expand?.();
  webApp?.requestFullscreen?.();
  updateViewportHeight();
  webApp?.onEvent?.("viewportChanged", updateViewportHeight);
}

export function openMiniApp(url: string) {
  const webApp = window.Telegram?.WebApp;

  if (webApp?.openTelegramLink) {
    webApp.openTelegramLink(url);
    return;
  }

  if (webApp?.openLink) {
    webApp.openLink(url);
    return;
  }

  window.open(url, "_blank", "noopener,noreferrer");
}
