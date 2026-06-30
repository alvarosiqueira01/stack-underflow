"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useLogin } from "@/features/auth/hooks/use-login";
import { loginSchema, type LoginData } from "@/features/auth/schemas/login.schema";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({ resolver: zodResolver(loginSchema) });

  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutate, isPending, error } = useLogin();

  function onSubmit(data: LoginData) {
    mutate(data, {
      onSuccess: () => router.push(searchParams.get("redirect") || "/"),
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium">Email or Username</label>
        <Input placeholder="amelie@untitled.com" {...register("email")} />
        {errors.email && <p className="mt-1.5 text-sm text-red-500">{errors.email.message}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">Password</label>
        <Input
          type="password"
          {...register("password")}
          className={error ? "border-red-400 focus:border-red-400" : undefined}
        />
        {errors.password && (
          <p className="mt-1.5 text-sm text-red-500">{errors.password.message}</p>
        )}
        {error && (
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-red-500">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              !
            </span>
            Incorrect email or password. Please try again.
          </p>
        )}
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-zinc-600">
          <input type="checkbox" {...register("remember")} /> Remember me
        </label>
        <a className="font-medium text-[#2F6BFF]">Forgot password?</a>
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Signing in..." : "Sign In"}
      </Button>

      <div className="flex items-center gap-3 text-sm text-zinc-400">
        <span className="h-px flex-1 bg-zinc-200" />
        Or continue with
        <span className="h-px flex-1 bg-zinc-200" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-xl border py-2 text-sm font-medium"
        >
          <GitHubIcon className="h-4 w-4" />
          GitHub
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-xl border py-2 text-sm font-medium"
        >
          <GoogleIcon className="h-4 w-4" />
          Google
        </button>
      </div>

      <p className="text-center text-sm text-zinc-400">
        By joining, you agree to our{" "}
        <a className="underline hover:text-zinc-600">Terms</a> and{" "}
        <a className="underline hover:text-zinc-600">Privacy Policy</a>.
      </p>
    </form>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.49 2.87 8.3 6.84 9.64.5.09.68-.22.68-.49 0-.24-.01-1.05-.01-1.91-2.78.51-3.5-.69-3.72-1.32-.13-.33-.67-1.36-1.15-1.64-.39-.21-.95-.73-.01-.74.88-.01 1.51.82 1.72 1.16 1 1.69 2.6 1.22 3.24.92.1-.72.39-1.22.71-1.5-2.49-.28-5.1-1.27-5.1-5.62 0-1.24.44-2.27 1.16-3.07-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18.91-.26 1.89-.39 2.86-.39.97 0 1.95.13 2.86.39 2.19-1.5 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.72.8 1.16 1.82 1.16 3.07 0 4.36-2.62 5.34-5.12 5.61.41.36.76 1.07.76 2.16 0 1.56-.01 2.82-.01 3.21 0 .27.18.59.69.49A10.27 10.27 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.07 5.07 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.67-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A10.99 10.99 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A10.98 10.98 0 0 0 12 1a11 11 0 0 0-9.82 6.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52Z"
      />
    </svg>
  );
}
