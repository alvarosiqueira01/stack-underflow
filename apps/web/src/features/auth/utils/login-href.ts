/**
 * Monta o link para /login carregando a página atual como `redirect`,
 * para que o usuário volte exatamente de onde saiu depois de autenticar.
 */
export function loginHref(currentPath: string, tab: "login" | "register" = "login") {
  const params = new URLSearchParams({ redirect: currentPath });
  if (tab === "register") params.set("tab", "register");
  return `/login?${params.toString()}`;
}
