import { Response, NextFunction } from 'express';
import { userService } from './user.service';
import { ApiResponse } from '../../utils/apiResponse';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';

export class UserController {
  async getMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = await userService.getProfile(req.user!.id);
      return ApiResponse.success(res, user);
    } catch (error) {
      return next(error);
    }
  }

  async getUserById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = await userService.getProfile(req.params.id);
      return ApiResponse.success(res, user);
    } catch (error) {
      return next(error);
    }
  }

  async updateMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updatedUser = await userService.updateProfile(req.user!.id, req.body);
      return ApiResponse.success(res, updatedUser, 'Profil başarıyla güncellendi');
    } catch (error) {
      return next(error);
    }
  }

  async listUsers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const result = await userService.listUsers(page, limit);
      return ApiResponse.success(res, result);
    } catch (error) {
      return next(error);
    }
  }
}

export const userController = new UserController();
