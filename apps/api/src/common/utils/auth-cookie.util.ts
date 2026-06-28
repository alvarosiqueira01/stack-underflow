import { Response } from 'express';
import { env } from '../../config/env.config';

export const AUTH_COOKIE_NAME = 'access_token';

const COOKIE_MAX_AGE_MS = 60 * 60 * 1000; // 1h — alinhar com JWT_EXPIRES_IN se ele mudar

export function setAuthCookie(res: Response, token: string): void {
  res.cookie(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE_MS,
    path: '/',
  });
}

export function clearAuthCookie(res: Response): void {
  res.clearCookie(AUTH_COOKIE_NAME, { path: '/' });
}
