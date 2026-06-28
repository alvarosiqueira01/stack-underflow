import { httpClient } from "@/lib/api/http-client";
import type { LoginData } from "../schemas/login.schema";

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  role: "new_user" | "user" | "established" | "moderator" | "admin";
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
