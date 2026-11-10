import { Response, NextFunction } from 'express';
import { swapService } from './swap.service';
import { ApiResponse } from '../../utils/apiResponse';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';

export class SwapController {
  async createSwapRequest(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const swap = await swapService.createSwapRequest(req.user!.id, req.body);
      return ApiResponse.created(res, swap, 'Takas isteği başarıyla iletildi');
    } catch (error) {
      return next(error);
    }
  }

  async updateSwapStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updatedSwap = await swapService.updateSwapStatus(req.user!.id, req.params.id, req.body);
      return ApiResponse.success(res, updatedSwap, 'Takas durumu güncellendi');
    } catch (error) {
      return next(error);
    }
  }

  async listMySwaps(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const status = req.query.status as string | undefined;
      const swaps = await swapService.listUserSwaps(req.user!.id, status);
      return ApiResponse.success(res, swaps);
    } catch (error) {
      return next(error);
    }
  }
}

export const swapController = new SwapController();
