import { NextResponse } from "next/server";
import { games } from "@/lib/mock/db";

export function GET() {
  return NextResponse.json(games);
}
