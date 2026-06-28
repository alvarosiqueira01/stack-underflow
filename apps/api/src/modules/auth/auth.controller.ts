import { Request, Response } from 'express';
import { setAuthCookie, clearAuthCookie } from '../../common/utils/auth-cookie.util';
import { LoginSchema, RegisterSchema, SocialAuthSchema } from './auth.schema';
import * as authService from './auth.service';

export async function loginController(req: Request, res: Response): Promise<void> {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.issues, code: 400 });
    return;
  }

  try {
    const { accessToken, user } = await authService.login(parsed.data);
    setAuthCookie(res, accessToken);
    res.status(200).json(user);
  } catch (err: any) {
    res.status(err.status ?? 500).json({ message: err.message, code: err.status ?? 500 });
  }
}

export async function registerController(req: Request, res: Response): Promise<void> {
  const parsed = RegisterSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.issues, code: 400 });
    return;
  }

  try {
    const result = await authService.register(parsed.data);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(err.status ?? 500).json({ message: err.message, code: err.status ?? 500 });
  }
}

export async function socialAuthController(req: Request, res: Response): Promise<void> {
  const parsed = SocialAuthSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.issues, code: 400 });
    return;
  }

  try {
    const { accessToken, user } = await authService.socialAuth(parsed.data);
    setAuthCookie(res, accessToken);
    res.status(200).json(user);
  } catch (err: any) {
    res.status(err.status ?? 500).json({ message: err.message, code: err.status ?? 500 });
  }
}

export async function logoutController(req: Request, res: Response): Promise<void> {
  clearAuthCookie(res);
  res.status(204).send();
}
