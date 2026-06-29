/**
 * Limiares de reputação por privilégio — espelha o sistema de "permission tiers"
 * do Stack Overflow. Fonte única usada tanto pelo `requireReputation()` (bloqueia
 * a requisição) quanto pelo cálculo de `permissions` na sessão (avisa o frontend
 * antes de tentar, pra ele nem mostrar a ação se o usuário não tem o privilégio).
 */
export const REPUTATION_THRESHOLDS = {
  COMMENT: 50,
  CREATE_TAG: 200,
  EDIT_OTHERS_POSTS: 200,
} as const;
