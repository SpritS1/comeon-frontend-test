"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";
import { useHydrated } from "@/lib/use-hydrated";
import { LoginScreen } from "@/components/login/login-screen";

export default function LoginPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const player = useAuthStore((s) => s.player);

  const alreadyIn = hydrated && !!player;

  useEffect(() => {
    if (alreadyIn) router.replace("/games");
  }, [alreadyIn, router]);

  // Already signed in — don't flash the form while we redirect.
  if (alreadyIn) return null;

  return <LoginScreen />;
}
