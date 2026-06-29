import { httpClient } from "@/lib/api/http-client";
import type { LoginData } from "../schemas/login.schema";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  username: string;
  role: "new_user" | "established" | "moderator" | "admin";
  reputation: number;
  badges: { gold: number; silver: number; bronze: number };
  permissions: { canComment: boolean; canCreateTag: boolean };
}

export async function login(data: LoginData): Promise<AuthUser> {
  const response = await httpClient.post<AuthUser>("/api/auth/login", {
    email: data.email,
    password: data.password,
  });
  return response.data;
}

export async function logout(): Promise<void> {
  await httpClient.post("/api/auth/logout");
}

/**
 * Restaura a sessão a partir do cookie httpOnly — chamado uma vez ao carregar
 * o app, já que o token nunca fica acessível ao JS pra "lembrar" o usuário.
 */
export async function getSession(): Promise<AuthUser> {
  const response = await httpClient.get<AuthUser>("/api/auth/session");
  return response.data;
}
