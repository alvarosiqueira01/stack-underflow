"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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

  const { mutate, isPending, error } = useLogin();

  function onSubmit(data: LoginData) {
    mutate(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-medium">Email</label>
        <Input placeholder="amelie@untitled.com" {...register("email")} />
        {errors.email && (
          <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Password</label>
        <Input type="password" {...register("password")} />
        {errors.password && (
          <p className="mt-2 text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <div className="flex justify-between text-sm">
        <label>
          <input type="checkbox" {...register("remember")} /> Remember me
        </label>
        <a className="text-[#2F6BFF]">Forgot password?</a>
      </div>

      {error && (
        <p className="text-sm text-red-500">
          Invalid email or password.
        </p>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Signing in..." : "Sign In"}
      </Button>

      <div className="py-5 text-center text-zinc-400">Or continue with</div>

      <div className="grid grid-cols-2 gap-4">
        <button type="button" className="rounded-xl border py-3">
          GitHub
        </button>
        <button type="button" className="rounded-xl border py-3">
          Google
        </button>
      </div>

      <p className="mt-8 text-center text-sm text-zinc-400">
        By joining, you agree to our Terms and Privacy Policy.
      </p>
    </form>
  );
}
