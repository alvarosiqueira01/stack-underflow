import { create } from "zustand";

interface AuthPromptState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

// Controla o popup global "faça login para continuar" — qualquer
// componente pode abri-lo via useRequireAuth, sem precisar saber
// onde o modal está montado na árvore.
export const useAuthPromptStore = create<AuthPromptState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
