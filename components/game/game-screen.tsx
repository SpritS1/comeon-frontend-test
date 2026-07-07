"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronLeftIcon } from "lucide-react";
import { GAME_META, metaFor } from "@/lib/games-meta";
import { useGames } from "@/lib/queries";
import { titleize } from "@/lib/format";
import { GameLauncher } from "@/components/game/game-launcher";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function GameScreen({ code }: { code: string }) {
  const { data: games } = useGames();
  const known = code in GAME_META;
  const meta = metaFor(code);
  const game = games?.find((g) => g.code === code);
  const name = game?.name ?? titleize(code);

  return (
    <div className="anim-screen-in flex min-h-screen flex-col overflow-x-clip bg-[#08090a]">
      <div
        className="relative flex flex-1 items-center justify-center overflow-hidden p-4"
        style={{ background: meta.gradient }}
      >
        <Link
          href="/games"
          className="absolute left-[18px] top-[18px] z-20 inline-flex h-11 items-center gap-2 rounded-xl border border-white/16 bg-[rgba(8,9,10,.55)] pl-[13px] pr-[17px] font-display text-[14.5px] font-semibold text-foreground backdrop-blur-[10px] transition-colors hover:border-white/30 hover:bg-[rgba(8,9,10,.8)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <ChevronLeftIcon className="size-[18px]" strokeWidth={2.2} />
          Back to lobby
        </Link>

        {known ? (
          <div className="relative z-[2] flex w-full flex-col items-center gap-6 px-2 pb-10 pt-20 text-center sm:pt-24">
            <Image
              src={meta.logo}
              alt={name}
              priority
              style={{ width: "auto", height: "auto" }}
              className="max-h-37.5 max-w-[min(360px,72vw)] object-contain drop-shadow-[0_20px_46px_rgba(0,0,0,.6)] sm:max-h-[200px] sm:max-w-[min(440px,60vw)]"
            />

            {/* The game iframe fills this responsive frame; the striped panel
                shows underneath while the embed loads. */}
            <div className="relative aspect-4/3 w-[min(680px,92vw)] overflow-hidden rounded-2xl border border-white/14 shadow-[0_30px_70px_-30px_rgba(0,0,0,.8)]">
              <div className="pointer-events-none absolute inset-0 z-0 flex flex-col items-center justify-center gap-2.5 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,.05)_0_12px,rgba(255,255,255,.02)_12px_24px)] text-white/80">
                <div className="flex items-center gap-2.5 text-[13px] font-semibold tracking-[.04em]">
                  <span className="anim-loading-dot size-[9px] rounded-full bg-brand shadow-[0_0_0_4px_rgba(142,181,13,.22)]" />
                  Loading reels…
                </div>
                <div className="font-display text-[12px] tracking-[.06em] text-white/50">
                  [ GAME EMBED · {name} ]
                </div>
              </div>
              <GameLauncher key={code} code={code} />
            </div>
          </div>
        ) : (
          <div className="relative z-2 flex max-w-90 flex-col items-center gap-4 px-6 text-center">
            <h1 className="font-display text-[24px] font-bold text-foreground">
              Game not found
            </h1>
            <p className="text-[14.5px] leading-[1.55] text-white/70">
              We couldn&apos;t find a game called{" "}
              <span className="font-semibold text-white">{code}</span>. It may
              have been retired.
            </p>
            <Link
              href="/games"
              className={cn(
                buttonVariants(),
                "h-[46px] rounded-xl px-5 font-display text-[15px] font-semibold",
              )}
            >
              Back to lobby
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
