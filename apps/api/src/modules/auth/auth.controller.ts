import { Request, Response } from 'express';
import { LoginSchema, RegisterSchema, SocialAuthSchema } from './auth.schema';
import * as authService from './auth.service';

export async function loginController(req: Request, res: Response): Promise<void> {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.issues, code: 400 });
    return;
  }

  try {
    const result = await authService.login(parsed.data);
    res.status(200).json(result);
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
    const result = await authService.socialAuth(parsed.data);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(err.status ?? 500).json({ message: err.message, code: err.status ?? 500 });
  }
}
