"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";

export function AuthPanel() {
  const searchParams = useSearchParams();
  const [isLogin, setIsLogin] = useState(searchParams.get("tab") !== "register");

  return (
    <>
      <div className="grid grid-cols-2 rounded-xl bg-zinc-100 p-1 mb-6">
        <button
          type="button"
          onClick={() => setIsLogin(true)}
          className={isLogin ? "rounded-lg bg-white py-2 font-medium shadow-sm" : "py-2 text-zinc-500"}
        >
          Sign In
        </button>

        <button
          type="button"
          onClick={() => setIsLogin(false)}
          className={!isLogin ? "rounded-lg bg-white py-2 font-medium shadow-sm" : "py-2 text-zinc-500"}
        >
          Create Account
        </button>
      </div>

      <div className="transition-all duration-300">{isLogin ? <LoginForm /> : <RegisterForm />}</div>
    </>
  );
}
