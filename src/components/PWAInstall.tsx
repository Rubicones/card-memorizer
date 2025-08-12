"use client";

import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "pwa-install-dismissed-at";
const INSTALLED_KEY = "pwa-installed";

export default function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const wasInstalled = window.localStorage.getItem(INSTALLED_KEY) === "1";
    setIsInstalled(wasInstalled);

    const recentlyDismissed = (() => {
      const dismissedAt = window.localStorage.getItem(DISMISS_KEY);
      if (!dismissedAt) return false;
      const msSinceDismiss = Date.now() - Number(dismissedAt);
      const fourteenDaysMs = 14 * 24 * 60 * 60 * 1000;
      return msSinceDismiss < fourteenDaysMs;
    })();

    const handler = (e: Event) => {
      // Defer the browser prompt until the user clicks our button
      e.preventDefault();
      if (wasInstalled || recentlyDismissed) return;
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    const onInstalled = () => {
      window.localStorage.setItem(INSTALLED_KEY, "1");
      setIsInstalled(true);
      setShowInstallPrompt(false);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", onInstalled as EventListener);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", onInstalled as EventListener);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      window.localStorage.setItem(INSTALLED_KEY, "1");
      setShowInstallPrompt(false);
      setIsInstalled(true);
    }

    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    setDeferredPrompt(null);
    try {
      window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {}
  };

  if (!showInstallPrompt || isInstalled) return null;

  return (
    <div className="fixed inset-x-0 bottom-3 z-50 px-6">
      <div className="mx-auto max-w-[560px] bg-background/95 backdrop-blur border border-border text-foreground rounded-md shadow-sm px-3 py-2 w-full">
        <div className="flex items-center gap-3">
          <Download className="w-4 h-4 text-foreground/70" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium leading-none truncate">Install Memento</p>
            <p className="text-xs text-muted-foreground mt-0.5">Add to your home screen</p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleInstallClick}
              className="h-8 px-3 rounded-md border border-border text-sm text-foreground hover:bg-foreground/10 transition-colors"
            >
              Install
            </button>
            <button
              onClick={handleDismiss}
              aria-label="Dismiss"
              className="h-8 w-8 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
