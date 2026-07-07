import type { ComponentProps } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function LightInput({
  className,
  ...props
}: ComponentProps<typeof Input>) {
  return (
    <Input
      className={cn(
        "h-12 rounded-xl border-[1.5px] border-[#e0e2d8] bg-white text-[15px] text-ink shadow-none " +
          "placeholder:text-[#9aa08f] transition-colors " +
          "focus-visible:border-brand focus-visible:ring-[3px] focus-visible:ring-brand/20 " +
          "dark:bg-white dark:border-[#e0e2d8] dark:focus-visible:border-brand",
        className,
      )}
      {...props}
    />
  );
}
