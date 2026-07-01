import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTagDetails, updateTagPreference } from "../api/tags.api";

export function useTagDetails(id: string) {
  return useQuery({
    queryKey: ["tags", "details", id],
    queryFn: () => getTagDetails(id),
  });
}

export function useUpdateTagPreference(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: "watching" | "ignored" | "none") => updateTagPreference(id, status),
    onSuccess: () => {
      // Invalida as preferências globais de tags para atualizar a barra lateral/painel direito
      queryClient.invalidateQueries({ queryKey: ["tags", "preferences"] });
    },
  });
}