import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.config';
import { usersRepository } from '../repositories/users.repository';
import { UserRole } from '../types/user.types';
import { AUTH_COOKIE_NAME } from '../utils/auth-cookie.util';

export interface JwtPayload {
  sub: string;
  id: string;
  email: string;
  username: string;
  role: UserRole;
  reputation?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Verifica o JWT no cookie httpOnly (browser) ou no header Authorization (clientes não-browser),
 * e então busca `role`/`reputation` frescos no banco — não confia nesses campos do JWT, porque
 * ambos mudam com frequência (votos, respostas aceitas, promoção a moderador) e o token pode
 * durar dias (`JWT_EXPIRES_IN`), o que deixaria esses valores desatualizados até o próximo login.
 * Rejeita com 401 se o token estiver ausente/inválido ou se o usuário não existir mais.
 */
export async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  const cookieToken = req.cookies?.[AUTH_COOKIE_NAME];
  const authHeader = req.headers.authorization;
  const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined;

  const token = cookieToken ?? headerToken;

  if (!token) {
    res.status(401).json({ message: 'Authentication is required.', code: 401 });
    return;
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    const user = await usersRepository.findById(payload.sub);

    if (!user) {
      res.status(401).json({ message: 'Session is no longer valid.', code: 401 });
      return;
    }

    req.user = {
      sub: payload.sub,
      id: payload.sub,
      email: user.email,
      username: user.username,
      role: user.role,
      reputation: user.reputation,
    };
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token.', code: 401 });
  }
}

// Verifica se o usuário tem a reputação mínima exigida para a ação.
// `req.user.reputation` já vem fresco do banco — ver authMiddleware.
export const requireReputation = (minScore: number) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userReputation = req.user?.reputation ?? 0;
    if (userReputation < minScore) {
      res.status(403).json({
        message: `Forbidden: Requires at least ${minScore} reputation points. You have ${userReputation}.`,
      });
      return;
    }
    next();
  };
};

/**
 * Middleware de autorização por role.
 * Rejeita com 403 se o usuário não tiver o nível exigido.
 *
 * @example
 * app.delete('/api/questions/:id', authMiddleware, requireRole('moderator'), controller.delete);
 */
export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: 'You do not have permission to access this resource.', code: 403 });
      return;
    }
    next();
  };
}
