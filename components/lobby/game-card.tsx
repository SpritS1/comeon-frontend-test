import type { CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRightIcon } from "lucide-react";
import type { Game } from "@/lib/api";
import { metaFor } from "@/lib/games-meta";

export function GameCard({ game, index = 0 }: { game: Game; index?: number }) {
  const meta = metaFor(game.code);

  return (
    <Link
      href={`/games/${game.code}`}
      aria-label={`Play ${game.name}`}
      style={{ "--i": index } as CSSProperties}
      className="anim-card-in group flex flex-col overflow-hidden rounded-[18px] bg-surface shadow-[0_12px_30px_-18px_rgba(0,0,0,.7)] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(.2,.7,.2,1)] hover:-translate-y-[5px] hover:shadow-[0_22px_44px_-20px_rgba(0,0,0,.85),0_18px_50px_-22px_rgba(142,181,13,.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div
        className="relative flex h-[162px] items-center justify-center overflow-hidden"
        style={{ background: meta.gradient }}
      >
        <span className="absolute left-[11px] top-[11px] z-[3] rounded-full bg-black/40 px-[9px] py-1 text-[10.5px] font-bold uppercase tracking-[.08em] text-white backdrop-blur-sm">
          {meta.tag}
        </span>
        <Image
          src={meta.logo}
          alt={game.name}
          style={{ width: "auto", height: "auto" }}
          className="max-h-[74%] max-w-[78%] object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,.5)] transition-transform duration-[400ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.07]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-black/25 to-transparent"
        />
      </div>

      <div className="flex flex-1 flex-col p-4 pt-[15px]">
        <h3 className="mb-[5px] font-display text-[17px] font-semibold tracking-[-.01em] text-ink">
          {game.name}
        </h3>
        <p className="mb-[15px] line-clamp-2 text-[13px] leading-[1.5] text-ink-muted">
          {game.description}
        </p>
        <span className="mt-auto flex h-[42px] w-full items-center justify-center gap-[7px] rounded-[10px] bg-brand font-display text-[14.5px] font-semibold text-brand-ink transition-[filter,box-shadow] duration-200 group-hover:brightness-[1.07] group-hover:shadow-[0_8px_18px_-8px_rgba(142,181,13,.7)]">
          Play
          <ChevronRightIcon
            className="size-4 transition-transform duration-200 group-hover:translate-x-[3px]"
            strokeWidth={2.4}
          />
        </span>
      </div>
    </Link>
  );
}
