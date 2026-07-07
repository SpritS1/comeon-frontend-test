import { NextResponse } from "next/server";

// Same code -> CDN src mapping baked into public/comeon.game-1.1.min.js.
// Checked server-side because the CDN doesn't send CORS headers, so the
// browser can't read the response status directly.
const GAME_SRC: Record<string, string> = {
  feastingfox:
    "https://d2k3wptpwv4u4d.cloudfront.net/mcasino/quickspin/feastingfox/index.html?moneymode=fun",
  bookofinferno94:
    "https://d2k3wptpwv4u4d.cloudfront.net/mcasino/quickspin/bookofinferno/index.html?moneymode=fun",
  warpwreckers:
    "https://d2k3wptpwv4u4d.cloudfront.net/mcasino/quickspin/warpwreckers/index.html?moneymode=fun",
  renosevens:
    "https://d2k3wptpwv4u4d.cloudfront.net/mcasino/quickspin/renosevens/index.html?moneymode=fun",
  scattermonsters:
    "https://d2k3wptpwv4u4d.cloudfront.net/mcasino/quickspin/scattermonsters/index.html?moneymode=fun",
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  const src = GAME_SRC[code];
  if (!src) return NextResponse.json({ ok: false }, { status: 404 });

  try {
    const res = await fetch(src, { method: "HEAD", cache: "no-store" });
    return NextResponse.json({ ok: res.ok });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
