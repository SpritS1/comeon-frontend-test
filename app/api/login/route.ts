import { NextResponse } from "next/server";
import { players } from "@/lib/mock/db";

export async function POST(req: Request) {
  let body: { username?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const username = (body.username ?? "").trim();
  const password = body.password ?? "";
  const record = players[username];

  if (record && record.password === password) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _pw, ...player } = record;
    return NextResponse.json({ status: "success", player });
  }

  return NextResponse.json(
    { status: "fail", error: "player does not exist or wrong password" },
    { status: 400 },
  );
}
