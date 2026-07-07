"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";
import { useHydrated } from "@/lib/use-hydrated";
import { BrandLogo } from "@/components/brand-logo";

// Client-side guard. The mock API has no real session/token to verify, so
// "protected" means: redirect to /login if there's no player in the store.
// `useHydrated()` keeps the first client render identical to the server render
// (the loader), since auth state only exists in the browser (sessionStorage).
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const hydrated = useHydrated();
  const player = useAuthStore((s) => s.player);

  useEffect(() => {
    if (hydrated && !player) router.replace("/login");
  }, [hydrated, player, router]);

  if (!hydrated || !player) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <BrandLogo className="h-7 animate-pulse opacity-70" />
      </div>
    );
  }

  return <>{children}</>;
}
