import { NextResponse } from "next/server";
import { players } from "@/lib/mock/db";

export async function POST(req: Request) {
  let body: { username?: string };
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const username = body.username ?? "";

  if (username in players) {
    return NextResponse.json({ status: "success" });
  }

  return NextResponse.json(
    { status: "fail", error: "Username do not match!" },
    { status: 400 },
  );
}
