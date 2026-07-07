import { describe, it, expect } from "vitest";
import { ALL_CATEGORY_ID, inCategory, filterGames, pageItems } from "./lobby";
import type { Game } from "@/lib/api";

function game(overrides: Partial<Game>): Game {
  return {
    name: "Feasting Fox",
    description: "A hungry fox raids the henhouse.",
    code: "feastingfox",
    icon: "feastingfox.png",
    categoryIds: [1],
    ...overrides,
  };
}

const games: Game[] = [
  game({ name: "Feasting Fox", code: "feastingfox", categoryIds: [1] }),
  game({ name: "Book of Inferno", code: "bookofinferno94", categoryIds: [2] }),
  game({ name: "Warp Wreckers", code: "warpwreckers", categoryIds: [1, 2] }),
];

describe("inCategory", () => {
  it("matches every game for the 'all' category", () => {
    expect(inCategory(games[0], ALL_CATEGORY_ID)).toBe(true);
    expect(inCategory(games[1], ALL_CATEGORY_ID)).toBe(true);
  });

  it("matches only games that include the given category id", () => {
    expect(inCategory(games[0], 1)).toBe(true);
    expect(inCategory(games[0], 2)).toBe(false);
    expect(inCategory(games[2], 2)).toBe(true);
  });
});

describe("filterGames", () => {
  it("returns everything for the 'all' category and empty query", () => {
    expect(filterGames(games, ALL_CATEGORY_ID, "")).toHaveLength(3);
  });

  it("filters by category", () => {
    const result = filterGames(games, 2, "");
    expect(result.map((g) => g.code)).toEqual([
      "bookofinferno94",
      "warpwreckers",
    ]);
  });

  it("filters by a case-insensitive name search", () => {
    const result = filterGames(games, ALL_CATEGORY_ID, "warp");
    expect(result.map((g) => g.code)).toEqual(["warpwreckers"]);
  });

  it("combines category and search filters", () => {
    const result = filterGames(games, 1, "warp");
    expect(result.map((g) => g.code)).toEqual(["warpwreckers"]);
  });

  it("returns no results when nothing matches", () => {
    expect(filterGames(games, ALL_CATEGORY_ID, "nope")).toEqual([]);
  });
});

describe("pageItems", () => {
  it("returns every page when total fits without ellipsis (<=7)", () => {
    expect(pageItems(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(pageItems(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("windows around the current page with a trailing ellipsis near the start", () => {
    expect(pageItems(1, 10)).toEqual([1, 2, "…", 10]);
  });

  it("windows around the current page with a leading ellipsis near the end", () => {
    expect(pageItems(10, 10)).toEqual([1, "…", 9, 10]);
  });

  it("shows ellipses on both sides when current page is in the middle", () => {
    expect(pageItems(5, 10)).toEqual([1, "…", 4, 5, 6, "…", 10]);
  });
});
