import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { GameLauncher } from "./game-launcher";

// next/script never actually loads a script in jsdom, so it never fires
// onReady/onLoad on its own — stub it to call them on mount, like a script
// that's already cached and ready immediately.
vi.mock("next/script", () => ({
  default: ({
    onReady,
    onLoad,
  }: {
    onReady?: () => void;
    onLoad?: () => void;
  }) => {
    onReady?.();
    onLoad?.();
    return null;
  },
}));

describe("GameLauncher", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    delete (window as { comeon?: unknown }).comeon;
  });

  it("shows an unavailable message when the health check fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: false }))),
    );
    const launch = vi.fn();
    window.comeon = { game: { launch } };

    render(<GameLauncher code="bookofinferno94" />);

    await waitFor(() =>
      expect(screen.getByText("Game unavailable")).toBeInTheDocument(),
    );
    expect(launch).not.toHaveBeenCalled();
  });

  it("launches the game once the health check succeeds", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }))),
    );
    const launch = vi.fn();
    window.comeon = { game: { launch } };

    render(<GameLauncher code="bookofinferno94" />);

    await waitFor(() => expect(launch).toHaveBeenCalledWith("bookofinferno94"));
    expect(screen.queryByText("Game unavailable")).not.toBeInTheDocument();
  });

  it("shows an unavailable message when the health check request errors", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));
    window.comeon = { game: { launch: vi.fn() } };

    render(<GameLauncher code="bookofinferno94" />);

    await waitFor(() =>
      expect(screen.getByText("Game unavailable")).toBeInTheDocument(),
    );
  });
});
