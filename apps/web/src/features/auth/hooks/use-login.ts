import { useMutation } from "@tanstack/react-query";
import { login } from "../api/auth.api";
import { useAuthStore } from "../stores/auth.store";

export function useLogin() {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: login,
    onSuccess: (user) => setUser(user),
  });
}
