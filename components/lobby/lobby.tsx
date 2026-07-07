"use client";

import { useMemo, useRef, useState, type CSSProperties } from "react";
import {
  SearchIcon,
  XIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useGames, useCategories } from "@/lib/queries";
import type { Game } from "@/lib/api";
import { FEATURED_CODE } from "@/lib/games-meta";
import { titleCase } from "@/lib/format";
import { LobbyHeader } from "@/components/lobby/lobby-header";
import { FeaturedBanner } from "@/components/lobby/featured-banner";
import { GameCard } from "@/components/lobby/game-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 4;
export const ALL_CATEGORY_ID = 0;

export function inCategory(game: Game, categoryId: number) {
  return (
    categoryId === ALL_CATEGORY_ID || game.categoryIds.includes(categoryId)
  );
}

// `query` is expected pre-trimmed/lowercased (the component derives it once
// and reuses it as a memo dependency).
export function filterGames(
  games: Game[],
  categoryId: number,
  query: string,
): Game[] {
  return games.filter(
    (g) =>
      inCategory(g, categoryId) &&
      (query === "" || g.name.toLowerCase().includes(query)),
  );
}

function pillClass(active: boolean) {
  return cn(
    "inline-flex h-[38px] shrink-0 items-center whitespace-nowrap rounded-full border px-4 font-display text-[14px] font-semibold transition-all active:scale-[.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
    active
      ? "border-transparent bg-brand text-brand-ink shadow-[0_6px_18px_-6px_rgba(142,181,13,.6)]"
      : "border-white/15 bg-white/[.04] text-[#cfd3c6] hover:bg-white/[.08]",
  );
}

// Windowed page list with ellipsis, so pagination stays compact at scale.
export function pageItems(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const items: (number | "…")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) items.push("…");
  for (let p = start; p <= end; p++) items.push(p);
  if (end < total - 1) items.push("…");
  items.push(total);
  return items;
}

export function Lobby() {
  const { data: games, isLoading, isError, refetch, isFetching } = useGames();
  const { data: categories } = useCategories();

  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState(ALL_CATEGORY_ID);
  const [page, setPage] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);

  // Changing the result set always jumps back to the first page.
  const handleSearch = (value: string) => {
    setQuery(value);
    setPage(1);
  };
  const handleCategory = (id: number) => {
    setCategoryId(id);
    setPage(1);
  };

  const q = query.trim().toLowerCase();
  const filtered = useMemo(
    () => filterGames(games ?? [], categoryId, q),
    [games, categoryId, q],
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageGames = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const isDefaultView = q === "" && categoryId === ALL_CATEGORY_ID;
  const featured = (games ?? []).find((g) => g.code === FEATURED_CODE);
  const showFeatured = isDefaultView && !!featured && filtered.length > 0;

  const clearFilters = () => {
    setQuery("");
    setCategoryId(ALL_CATEGORY_ID);
    setPage(1);
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      className="anim-screen-in min-h-screen overflow-x-clip"
      style={{
        background:
          "radial-gradient(70% 38% at 12% 0%, rgba(142,181,13,.07) 0%, transparent 60%), radial-gradient(120% 60% at 80% -5%, #16190f 0%, #0c0d0b 55%)",
      }}
    >
      <LobbyHeader />

      <main className="mx-auto max-w-[1240px] px-4 pb-16 pt-[26px] sm:px-[22px]">
        {/* Title + search */}
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-[26px] font-bold tracking-[-.025em] text-foreground sm:text-[30px]">
              Games lobby
            </h1>
            <p className="mt-1.5 text-[14.5px] text-fg-dim">
              Pick a title and start spinning — {filtered.length}{" "}
              {filtered.length === 1 ? "game" : "games"} in view.
            </p>
          </div>
          <div className="relative w-full min-w-[240px] flex-1 sm:max-w-[340px]">
            <SearchIcon
              className="pointer-events-none absolute left-[14px] top-1/2 size-[18px] -translate-y-1/2 text-[#8b9080]"
              strokeWidth={1.9}
            />
            <Input
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search games…"
              aria-label="Search games"
              className="h-[46px] rounded-xl border-white/12 bg-white/5 pl-[42px] pr-11 text-[15px] text-foreground placeholder:text-fg-dim focus-visible:border-brand focus-visible:ring-[3px] focus-visible:ring-brand/[.16] dark:border-white/12 dark:bg-white/5"
            />
            {query !== "" && (
              <button
                type="button"
                onClick={() => handleSearch("")}
                aria-label="Clear search"
                className="absolute right-[7px] top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-fg-dim transition-colors hover:bg-white/[.07] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <XIcon className="size-4" strokeWidth={2.2} />
              </button>
            )}
          </div>
        </div>

        {/* Category pills */}
        <div className="scrollbar-none -mx-4 mb-[26px] flex gap-[9px] overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          {(categories ?? []).map((c) => {
            const active = c.id === categoryId;
            const count = (games ?? []).filter((g) =>
              inCategory(g, c.id),
            ).length;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => handleCategory(c.id)}
                className={pillClass(active)}
              >
                {titleCase(c.name)}
                {games && (
                  <span
                    className={cn(
                      "ml-2 rounded-full px-[7px] py-px text-[11.5px] font-bold tabular-nums",
                      active
                        ? "bg-black/[.14] text-brand-ink/85"
                        : "bg-white/[.08] text-fg-dim",
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <GridSkeleton />
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} retrying={isFetching} />
        ) : (
          <>
            {showFeatured && featured && <FeaturedBanner game={featured} />}

            {pageGames.length > 0 ? (
              <>
                <div
                  ref={gridRef}
                  className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(248px,1fr))]"
                >
                  {pageGames.map((g, i) => (
                    <GameCard key={g.code} game={g} index={i} />
                  ))}
                </div>

                {pageCount > 1 && (
                  <Pagination
                    current={currentPage}
                    total={pageCount}
                    onChange={handlePageChange}
                  />
                )}
              </>
            ) : (
              <EmptyState query={query} onClear={clearFilters} />
            )}
          </>
        )}
      </main>
    </div>
  );
}

function Pagination({
  current,
  total,
  onChange,
}: {
  current: number;
  total: number;
  onChange: (p: number) => void;
}) {
  const base =
    "inline-flex h-10 min-w-10 items-center justify-center rounded-[10px] border px-3 font-display text-[14px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:pointer-events-none disabled:opacity-40";
  const idle =
    "border-white/12 bg-white/[.03] text-foreground hover:bg-white/[.08]";

  return (
    <nav
      className="mt-8 flex items-center justify-center gap-2"
      aria-label="Pagination"
    >
      <button
        type="button"
        className={cn(base, idle)}
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        aria-label="Previous page"
      >
        <ChevronLeftIcon className="size-[18px]" strokeWidth={2.2} />
      </button>

      {pageItems(current, total).map((item, i) =>
        item === "…" ? (
          <span
            key={`e${i}`}
            className="px-1 text-fg-dim select-none"
            aria-hidden
          >
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            aria-current={item === current ? "page" : undefined}
            className={cn(
              base,
              item === current
                ? "border-transparent bg-brand text-brand-ink"
                : idle,
            )}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        className={cn(base, idle)}
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        aria-label="Next page"
      >
        <ChevronRightIcon className="size-[18px]" strokeWidth={2.2} />
      </button>
    </nav>
  );
}

function GridSkeleton() {
  return (
    <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(248px,1fr))]">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          style={{ "--i": i } as CSSProperties}
          className="anim-card-in anim-shimmer flex flex-col overflow-hidden rounded-[18px] bg-white/[.04]"
        >
          <Skeleton className="h-[162px] rounded-none bg-white/[.06]" />
          <div className="flex flex-col gap-3 p-4">
            <Skeleton className="h-4 w-2/3 bg-white/[.06]" />
            <Skeleton className="h-3 w-full bg-white/[.05]" />
            <Skeleton className="mt-2 h-[42px] w-full bg-white/[.05]" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({
  query,
  onClear,
}: {
  query: string;
  onClear: () => void;
}) {
  return (
    <div className="flex flex-col items-center rounded-[20px] border-[1.5px] border-dashed border-white/[.14] bg-white/[.02] px-5 py-16 text-center">
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-white/[.05] text-[#8b9080]">
        <SearchIcon className="size-[26px]" strokeWidth={1.8} />
      </div>
      <h3 className="mb-1.5 font-display text-[19px] font-semibold text-foreground">
        No games found
      </h3>
      <p className="mb-[18px] max-w-[320px] text-[14px] leading-[1.55] text-fg-dim">
        {query.trim()
          ? `We couldn't match “${query.trim()}”. Try another name or clear your filters.`
          : "Nothing here yet — try clearing your filters."}
      </p>
      <Button
        variant="outline"
        onClick={onClear}
        className="h-[42px] rounded-[10px] border-white/16 bg-transparent px-[18px] font-display text-[14px] font-medium text-foreground hover:bg-white/[.06] dark:border-white/16 dark:bg-transparent dark:hover:bg-white/[.06]"
      >
        Clear filters
      </Button>
    </div>
  );
}

function ErrorState({
  onRetry,
  retrying,
}: {
  onRetry: () => void;
  retrying: boolean;
}) {
  return (
    <div className="flex flex-col items-center rounded-[20px] border-[1.5px] border-dashed border-destructive/30 bg-destructive/[.06] px-5 py-16 text-center">
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <TriangleAlertIcon className="size-[26px]" strokeWidth={1.8} />
      </div>
      <h3 className="mb-1.5 font-display text-[19px] font-semibold text-foreground">
        Couldn&apos;t load the lobby
      </h3>
      <p className="mb-[18px] max-w-[320px] text-[14px] leading-[1.55] text-fg-dim">
        Something went wrong fetching the games. Check the connection and try
        again.
      </p>
      <Button
        onClick={onRetry}
        disabled={retrying}
        className="h-[42px] rounded-[10px] px-[18px] font-display text-[14px] font-semibold"
      >
        {retrying ? "Retrying…" : "Try again"}
      </Button>
    </div>
  );
}
