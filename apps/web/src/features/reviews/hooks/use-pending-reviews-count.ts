import { useQuery } from "@tanstack/react-query";
import { getReviewQueues } from "../api/reviews.api";

const REVIEWER_ROLES = ["established", "moderator", "admin"];

/**
 * Soma o `pendingCount` de todas as filas de revisão.
 * Só busca se o usuário tiver papel com permissão de revisar — `GET /api/reviews`
 * exige `established`/`moderator`/`admin` e devolve 403 pra `new_user`.
 */
export function usePendingReviewsCount(role: string | undefined) {
  return useQuery({
    queryKey: ["reviews", "pending-count"],
    queryFn: async () => {
      const queues = await getReviewQueues();
      return queues.reduce((total, queue) => total + queue.pendingCount, 0);
    },
    enabled: !!role && REVIEWER_ROLES.includes(role),
  });
}
