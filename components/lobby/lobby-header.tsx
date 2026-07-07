"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LogOutIcon } from "lucide-react";
import { logout } from "@/lib/api";
import { useAuthStore } from "@/lib/store/auth";
import { resolveAvatar } from "@/lib/assets";
import { initials } from "@/lib/format";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

export function LobbyHeader() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const username = useAuthStore((s) => s.username);
  const player = useAuthStore((s) => s.player);
  const clear = useAuthStore((s) => s.clear);

  const mutation = useMutation({
    mutationFn: () => logout(username ?? ""),
    onSettled: () => {
      clear();
      queryClient.clear();
      router.replace("/login");
    },
  });

  const avatar = resolveAvatar(player?.avatar);

  return (
    <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-2 border-b border-white/[.07] bg-[rgba(12,13,11,.82)] px-3 py-[10px] backdrop-blur-[14px] sm:gap-3 sm:px-[22px] sm:py-[15px]">
      <BrandLogo className="h-5 sm:h-6" />

      <div className="flex items-center gap-1.5 sm:gap-[14px]">
        <div className="flex items-center gap-2 rounded-full border border-white/[.08] bg-white/5 p-[4px] pr-1.5 sm:gap-[11px] sm:p-[6px] sm:pr-2">
          <Avatar className="size-7 sm:size-9">
            {avatar && <AvatarImage src={avatar.src} alt="" />}
            <AvatarFallback className="bg-brand/20 text-[11px] font-semibold text-brand sm:text-[13px]">
              {player ? initials(player.name) : "?"}
            </AvatarFallback>
            <AvatarBadge className="bg-brand" />
          </Avatar>
          <div className="pr-1 leading-[1.15]">
            <div className="text-[12px] font-bold text-[#F9F9F9] sm:text-[13.5px]">
              {player?.name ?? "Player"}
            </div>
            <div className="text-[10px] font-semibold text-[#93b52e] sm:text-[11.5px]">
              Online now
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className="h-8 gap-[5px] rounded-[10px] border-white/15 bg-transparent px-2.5 font-display text-[13px] font-medium text-[#cfd3c6] hover:border-white/25 hover:bg-white/[.06] hover:text-white dark:border-white/15 dark:bg-transparent dark:hover:bg-white/[.06] sm:h-10 sm:gap-[7px] sm:px-[15px] sm:text-[14px]"
        >
          <LogOutIcon className="size-[15px] sm:size-[17px]" strokeWidth={1.9} />
          <span className="hidden sm:inline">Log out</span>
        </Button>
      </div>
    </header>
  );
}
