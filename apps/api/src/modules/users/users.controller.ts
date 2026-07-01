import { Request, Response, NextFunction } from 'express';
import { UsersService } from './users.service';
import { toUserResponse } from './users.mapper';

type AuthenticatedRequest = Request & {
  user?: {
    id: string;
    reputation?: number;
    role?: string;
    [key: string]: any;
  };
};

const usersService = new UsersService();

export class UsersController {
  /**
   * GET /api/users
   * Rota pública para listar todos os usuários.
   * Repassa a query string (page, limit, search) diretamente para o service.
   */
  async getUsers(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await usersService.findAllUsers(req.query);
      res.status(200).json({
        ...result,
        users: result.users.map(toUserResponse),
      });
    } catch (error) {
      next(error); // Encaminha o erro para o error.middleware.ts
    }
  }

  /**
   * GET /api/users/:id
   * Rota pública para visualizar o perfil de um usuário específico.
   */
  async getUserById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await usersService.findUserById(req.params.id);
      res.status(200).json(toUserResponse(user));
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/users/me
   * Rota protegida. Atualiza o perfil do próprio usuário que fez a requisição.
   * Presume-se que o middleware `requireAuth` validou o token antes de chegar aqui.
   */
  async updateMe(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // Verificação de segurança adicional para garantir que o usuário está no contexto
      if (!req.user || !req.user.id) {
        res.status(401).json({ message: 'Unauthorized access' });
        return;
      }

      const updatedUser = await usersService.updateProfile(req.user.id, req.body);
      res.status(200).json(toUserResponse(updatedUser));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/users/:id/activity
   * Rota pública que retorna o feed cronológico de ações de um usuário.
   */
  async getActivity(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const activityFeed = await usersService.getUserActivityFeed(req.params.id, req.query);
      res.status(200).json(activityFeed);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/users/me/dashboard
   * Rota protegida. Coleta métricas agregadas da conta do usuário autenticado.
   */
  async getDashboard(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        res.status(401).json({ message: 'Unauthorized access' });
        return;
      }

      const stats = await usersService.getDashboardStats(req.user.id);
      res.status(200).json(stats);
    } catch (error) {
      next(error);
    }
  }

  async getTagPreferences(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        res.status(401).json({ message: 'Unauthorized access' });
        return;
      }

      const preferences = await usersService.getTagPreferences(req.user.id);
      res.status(200).json(preferences);
    } catch (error) {
      next(error);
    }
  }

  async updateTagPreferences(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        res.status(401).json({ message: 'Unauthorized access' });
        return;
      }

      const { action } = req.body; // action can be "watch" or "ignore"
      const updatedPreference = await usersService.updateTagPreferences(req.user.id, req.params.id, action);
      res.status(200).json(updatedPreference);
    } catch (error) {
      next(error);
    }

  }
}