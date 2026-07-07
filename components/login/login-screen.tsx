"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  UserIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  CircleAlertIcon,
  LoaderIcon,
} from "lucide-react";
import { login } from "@/lib/api";
import { useAuthStore } from "@/lib/store/auth";
import { BrandLogo } from "@/components/brand-logo";
import { LightInput } from "@/components/login/light-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { LoginSchemaFormValues, loginSchema } from "./schema/login-schema";

export function LoginScreen() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [showPass, setShowPass] = useState(false);
  const [shaking, setShaking] = useState(false);
  const shakeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const form = useForm<LoginSchemaFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: (v: LoginSchemaFormValues) => login(v.username, v.password),
    onSuccess: (player, v) => {
      setSession(v.username.trim(), player);
      toast.success(`Welcome back, ${player.name.split(" ")[0]}`, {
        description: player.event,
      });
      router.replace("/games");
    },
    onError: (err: Error) => {
      form.setError("root", { message: err.message });
      setShaking(false);
      requestAnimationFrame(() => {
        setShaking(true);
        if (shakeTimer.current) clearTimeout(shakeTimer.current);
        shakeTimer.current = setTimeout(() => setShaking(false), 520);
      });
    },
  });

  const username = form.register("username");
  const password = form.register("password");
  const errors = form.formState.errors;
  const errorMsg =
    errors.root?.message ??
    errors.username?.message ??
    errors.password?.message;

  return (
    <div
      className="anim-screen-in relative flex min-h-screen items-center justify-center overflow-x-clip px-5 py-7"
      style={{
        background:
          "radial-gradient(130% 90% at 50% -10%, #1c2114 0%, #0f110d 45%, #0a0b09 100%)",
      }}
    >
      <div
        aria-hidden
        className="anim-glow pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] max-w-[90vw] -translate-x-1/2 -translate-y-[60%] blur-[20px]"
        style={{
          background:
            "radial-gradient(circle, var(--brand) 0%, transparent 62%)",
          opacity: 0.16,
        }}
      />

      <div className="relative flex w-full max-w-[404px] flex-col items-center gap-[26px]">
        <BrandLogo className="h-[30px]" />

        <form
          onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
          onAnimationEnd={() => setShaking(false)}
          className={cn(
            "w-full rounded-[22px] bg-surface px-[30px] pb-[30px] pt-[34px] shadow-[0_30px_70px_-28px_rgba(0,0,0,.85),0_0_0_1px_rgba(255,255,255,.04)]",
            shaking && "anim-shake",
          )}
        >
          <h1 className="font-display text-[25px] font-semibold tracking-[-.02em] text-ink">
            Sign in to play
          </h1>
          <p className="mb-6 mt-[7px] text-[14.5px] leading-relaxed text-ink-soft">
            Log in to reach the lobby and spin up your favourites.
          </p>

          <Label className="mb-[7px] block text-[12px] font-semibold uppercase tracking-[.02em] text-[#6b7062]">
            Username
          </Label>
          <div className="relative mb-4">
            <UserIcon
              className="pointer-events-none absolute left-[14px] top-1/2 size-[18px] -translate-y-1/2 text-[#8b9080]"
              strokeWidth={1.9}
            />
            <LightInput
              {...username}
              onChange={(e) => {
                username.onChange(e);
                form.clearErrors("root");
              }}
              autoComplete="username"
              placeholder="rebecka"
              aria-invalid={!!errorMsg}
              className="pl-[42px] pr-[14px]"
            />
          </div>

          <Label className="mb-[7px] block text-[12px] font-semibold uppercase tracking-[.02em] text-[#6b7062]">
            Password
          </Label>
          <div className="relative mb-2">
            <LockIcon
              className="pointer-events-none absolute left-[14px] top-1/2 size-[18px] -translate-y-1/2 text-[#8b9080]"
              strokeWidth={1.9}
            />
            <LightInput
              {...password}
              onChange={(e) => {
                password.onChange(e);
                form.clearErrors("root");
              }}
              type={showPass ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              aria-invalid={!!errorMsg}
              className="pl-[42px] pr-[46px]"
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              aria-label={showPass ? "Hide password" : "Show password"}
              className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#8b9080] transition-colors hover:bg-black/5"
            >
              {showPass ? (
                <EyeIcon className="size-[18px]" strokeWidth={1.9} />
              ) : (
                <EyeOffIcon className="size-[18px]" strokeWidth={1.9} />
              )}
            </button>
          </div>

          {errorMsg && (
            <div className="mb-1 mt-0.5 flex items-center gap-[7px] text-[13px] font-medium text-destructive">
              <CircleAlertIcon
                className="size-[15px] shrink-0"
                strokeWidth={2}
              />
              <span>{errorMsg}</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={mutation.isPending}
            className="mt-4 h-[50px] w-full rounded-xl font-display text-base font-semibold tracking-[.01em] shadow-[0_10px_24px_-10px_rgba(142,181,13,.75)] hover:bg-primary hover:brightness-[1.06]"
          >
            {mutation.isPending ? (
              <LoaderIcon className="size-[18px] animate-spin" />
            ) : (
              "Login"
            )}
          </Button>

          <div className="mt-4 border-t border-[#ececdf] pt-[15px] text-center text-[12.5px] text-[#8b9080]">
            Demo access — username <b className="text-[#4f5548]">rebecka</b> ·
            password <b className="text-[#4f5548]">secret</b>
          </div>
        </form>
      </div>
    </div>
  );
}
