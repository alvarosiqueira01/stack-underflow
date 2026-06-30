/**
 * Erro com status HTTP — usar em vez de `throw { status, message }` ou
 * `throw new Error(message)` em services. Mantém stack trace real e
 * `instanceof Error`, e o `errorMiddleware` lê `.status` direto.
 */
export class HttpError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = 'HttpError';
  }
}
