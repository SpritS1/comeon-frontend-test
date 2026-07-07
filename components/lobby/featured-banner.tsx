import Link from "next/link";
import Image from "next/image";
import { ChevronRightIcon } from "lucide-react";
import type { Game } from "@/lib/api";
import { metaFor } from "@/lib/games-meta";

export function FeaturedBanner({ game }: { game: Game }) {
  const meta = metaFor(game.code);

  return (
    <Link
      href={`/games/${game.code}`}
      aria-label={`Play featured game ${game.name}`}
      className="group relative mb-7 block min-h-[232px] overflow-hidden rounded-[24px] border border-white/[.08] transition-[border-color,box-shadow] duration-300 hover:border-brand/40 hover:shadow-[0_24px_70px_-24px_rgba(142,181,13,.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      style={{ background: meta.gradient }}
    >
      <div
        aria-hidden
        className="anim-glow pointer-events-none absolute -right-20 -top-36 size-[360px] rounded-full bg-brand/25 blur-[110px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/35 to-transparent"
      />

      <div className="relative z-[2] flex flex-wrap items-center justify-between gap-6 p-6 sm:px-[38px] sm:py-[34px]">
        <div className="max-w-[470px]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-[7px] rounded-full bg-brand px-[11px] py-[5px] text-[11px] font-bold uppercase tracking-[.14em] text-brand-ink">
              <span className="size-[6px] animate-pulse rounded-full bg-brand-ink/80" />
              Featured
            </span>
            <span className="rounded-full border border-white/20 bg-black/30 px-[10px] py-[4px] text-[10.5px] font-bold uppercase tracking-[.1em] text-white/85 backdrop-blur-sm">
              {meta.tag}
            </span>
          </div>
          <h2 className="mb-2 mt-[14px] font-display text-[clamp(26px,4vw,33px)] font-bold leading-[1.08] tracking-[-.02em] text-white [text-shadow:0_2px_18px_rgba(0,0,0,.5)]">
            {game.name}
          </h2>
          <p className="mb-5 text-[14.5px] leading-[1.55] text-white/80">
            {meta.tagline || game.description}
          </p>
          <span className="cta-sheen inline-flex h-12 items-center gap-2 rounded-[12px] bg-brand px-[22px] font-display text-[15px] font-semibold text-brand-ink shadow-[0_10px_24px_-10px_rgba(142,181,13,.8)] transition-[filter,box-shadow] duration-200 group-hover:brightness-[1.07] group-hover:shadow-[0_14px_30px_-10px_rgba(142,181,13,.9)]">
            Play now
            <ChevronRightIcon
              className="size-[17px] transition-transform duration-200 group-hover:translate-x-[3px]"
              strokeWidth={2.4}
            />
          </span>
        </div>
        <Image
          src={meta.logo}
          alt={game.name}
          priority
          style={{ width: "auto", height: "auto" }}
          className="anim-float max-h-[124px] max-w-[230px] object-contain drop-shadow-[0_14px_30px_rgba(0,0,0,.55)] sm:max-h-[156px] sm:max-w-[290px]"
        />
      </div>
    </Link>
  );
}
