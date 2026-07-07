"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

declare global {
  interface Window {
    comeon?: { game: { launch: (code: string) => void } };
  }
}

type Status = "checking" | "ready" | "unavailable";

// Wraps the provided comeon.game library: it replaces #game-launch with a
// game <iframe>. The script must be a real static URL (public/), loaded via
// next/script — not imported as a module.
//
// The iframe's `load` event fires even when the CDN answers with a 403 (the
// browser still renders the error page), so it can't tell us the launch
// failed. Instead /api/games/[code]/health does the reachability check
// server-side, where CORS doesn't get in the way of reading the status.
export function GameLauncher({ code }: { code: string }) {
  const launchedFor = useRef<string | null>(null);
  const scriptReady = useRef(false);
  const [status, setStatus] = useState<Status>("checking");

  const launch = useCallback(() => {
    if (typeof window === "undefined" || !window.comeon) return;
    if (launchedFor.current === code) return;
    if (!document.getElementById("game-launch")) return;
    try {
      window.comeon.game.launch(code);
      launchedFor.current = code;
    } catch {
      toast.error("Failed to launch game. Please try again later.");
      setStatus("unavailable");
    }
  }, [code]);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/games/${code}/health`)
      .then((res) => res.json())
      .then(({ ok }: { ok: boolean }) => {
        if (cancelled) return;
        setStatus(ok ? "ready" : "unavailable");
      })
      .catch(() => {
        if (!cancelled) setStatus("unavailable");
      });

    return () => {
      cancelled = true;
    };
  }, [code]);

  // Covers both orders: script already loaded on a previous screen, or the
  // health check resolving after the script signals ready.
  useEffect(() => {
    if (status === "ready" && scriptReady.current) launch();
  }, [status, launch]);

  const handleScriptReady = () => {
    scriptReady.current = true;
    if (status === "ready") launch();
  };

  if (status === "unavailable") {
    return (
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-[#0c0d0f] px-6 text-center">
        <p className="font-display text-[14.5px] font-semibold text-white">
          Game unavailable
        </p>
        <p className="text-[13px] leading-[1.5] text-white/60">
          We couldn&apos;t reach the game provider. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <>
      <Script
        src="/comeon.game-1.1.min.js"
        strategy="afterInteractive"
        onReady={handleScriptReady}
        onLoad={handleScriptReady}
      />
      <div id="game-launch" className="absolute inset-0 z-10" />
    </>
  );
}
