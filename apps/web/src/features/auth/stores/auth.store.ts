import { create } from "zustand";
import type { AuthUser } from "../api/auth.api";

interface AuthState {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
}

// Guarda apenas dados do usuário para a UI — o JWT vive só no cookie httpOnly,
// nunca passa por aqui (evita exposição a XSS).
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
