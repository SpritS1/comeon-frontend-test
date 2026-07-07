import { describe, it, expect, vi, afterEach } from "vitest";
import { GET } from "./route";

function paramsFor(code: string) {
  return { params: Promise.resolve({ code }) };
}

describe("GET /api/games/[code]/health", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns ok:false for an unknown game code without hitting the network", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    const res = await GET(new Request("http://test"), paramsFor("not-a-game"));

    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ ok: false });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("returns ok:true when the CDN responds successfully", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 200 })),
    );

    const res = await GET(new Request("http://test"), paramsFor("feastingfox"));

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it("returns ok:false when the CDN responds with 403", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 403 })),
    );

    const res = await GET(
      new Request("http://test"),
      paramsFor("bookofinferno94"),
    );

    expect(await res.json()).toEqual({ ok: false });
  });

  it("returns ok:false when the request throws (network error)", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("boom")));

    const res = await GET(new Request("http://test"), paramsFor("renosevens"));

    expect(await res.json()).toEqual({ ok: false });
  });
});
