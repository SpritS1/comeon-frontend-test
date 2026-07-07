import { brandLogo } from "@/lib/assets";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function BrandLogo({ className }: { className?: string }) {
  return (
    <Image
      src={brandLogo.src}
      alt="ComeOn"
      width={124}
      height={24}
      className={cn("w-auto select-none", className)}
    />
  );
}
