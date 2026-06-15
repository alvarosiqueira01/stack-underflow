import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.config';
import { UserRole } from '../types/user.types';

export interface JwtPayload {
  sub: string;
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
 * Verifica o JWT no header Authorization.
 * Rejeita com 401 se ausente ou inválido.
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authentication is required.', code: 401 });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token.', code: 401 });
  }
}

// Verifica se o usuário tem a reputação mínima exigida para a ação
export const requireReputation = (minScore: number) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userReputation = req.user?.reputation || 0;
    if (userReputation < minScore) {
      res.status(403).json({ 
        message: `Forbidden: Requires at least ${minScore} reputation points. You have ${userReputation}.` 
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
