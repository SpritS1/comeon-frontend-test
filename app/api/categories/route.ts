import { NextResponse } from "next/server";
import { categories } from "@/lib/mock/db";

export function GET() {
  return NextResponse.json(categories);
}
