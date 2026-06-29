import { isAxiosError } from "axios";

const DEFAULT_MESSAGE = "Algo deu errado. Tente novamente.";

/** Extrai a mensagem de erro vinda da API (`{ message, code }`) de um erro do axios. */
export function extractErrorMessage(error: unknown, fallback = DEFAULT_MESSAGE): string {
  if (isAxiosError(error)) {
    return error.response?.data?.message ?? fallback;
  }
  return fallback;
}
