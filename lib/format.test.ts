import { describe, it, expect } from "vitest";
import { titleCase, titleize, initials } from "./format";

describe("titleCase", () => {
  it("capitalizes each word and lowercases the rest", () => {
    expect(titleCase("SLOTS")).toBe("Slots");
    expect(titleCase("table games")).toBe("Table Games");
  });

  it("handles a single word", () => {
    expect(titleCase("jackpot")).toBe("Jackpot");
  });
});

describe("titleize", () => {
  it("replaces hyphens/underscores with spaces and capitalizes words", () => {
    expect(titleize("warp-wreckers")).toBe("Warp Wreckers");
    expect(titleize("book_of_inferno")).toBe("Book Of Inferno");
  });

  it("collapses repeated separators into a single space", () => {
    expect(titleize("foo--bar__baz")).toBe("Foo Bar Baz");
  });

  it("returns an empty string unchanged", () => {
    expect(titleize("")).toBe("");
  });
});

describe("initials", () => {
  it("takes the first letter of the first two words, uppercased", () => {
    expect(initials("Rebecka Awesome")).toBe("RA");
  });

  it("returns a single initial for a one-word name", () => {
    expect(initials("Rebecka")).toBe("R");
  });

  it("ignores words beyond the second", () => {
    expect(initials("Eric van Beard")).toBe("EV");
  });
});
