import { useEffect } from "react";
import { getSession } from "../api/auth.api";
import { useAuthStore } from "../stores/auth.store";

/**
 * Roda uma vez quando o app carrega — tenta restaurar a sessão a partir do
 * cookie httpOnly. Falha silenciosamente (401) quando não há sessão ativa,
 * o que é o caso normal de um visitante deslogado.
 */
export function useSessionBootstrap() {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    getSession()
      .then(setUser)
      .catch(() => {
        // sem sessão ativa — mantém o usuário deslogado, sem erro visível
      });
  }, [setUser]);
}
