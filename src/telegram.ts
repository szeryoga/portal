declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready?: () => void;
        expand?: () => void;
        openLink?: (url: string) => void;
        openTelegramLink?: (url: string) => void;
      };
    };
  }
}

export function prepareTelegramWebApp() {
  window.Telegram?.WebApp?.ready?.();
  window.Telegram?.WebApp?.expand?.();
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
