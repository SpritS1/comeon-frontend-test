import type { StaticImageData } from "next/image";
import logo from "@/assets/logo.svg";
import rebecka from "@/assets/avatar/rebecka.jpg";
import eric from "@/assets/avatar/eric.jpg";
import stoffe from "@/assets/avatar/stoffe.jpg";

export const brandLogo = logo as unknown as StaticImageData;

// The API returns avatar paths like "images/avatar/rebecka.jpg"; resolve them
// to the imported (optimized) asset by filename.
const AVATARS: Record<string, StaticImageData> = {
  "rebecka.jpg": rebecka,
  "eric.jpg": eric,
  "stoffe.jpg": stoffe,
};

export function resolveAvatar(path?: string): StaticImageData | undefined {
  if (!path) return undefined;
  const file = path.split("/").pop() ?? "";
  return AVATARS[file];
}
