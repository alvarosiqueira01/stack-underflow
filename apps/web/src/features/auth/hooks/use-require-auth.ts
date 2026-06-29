import { useAuthPromptStore } from "../stores/auth-prompt.store";
import { useAuthStore } from "../stores/auth.store";

/**
 * Retorna uma função `requireAuth(action)` — executa `action` se o usuário
 * estiver logado, ou abre o popup de login/cadastro caso contrário.
 *
 * Use em qualquer botão que precise de autenticação mas não tenha um
 * Log in / Sign up explícito ao lado (ex: votar, comentar) — o composer
 * de resposta já mostra esses botões diretamente e não precisa disso.
 */
export function useRequireAuth() {
  const user = useAuthStore((state) => state.user);
  const openPrompt = useAuthPromptStore((state) => state.open);

  return function requireAuth(action: () => void) {
    if (user) {
      action();
    } else {
      openPrompt();
    }
  };
}
