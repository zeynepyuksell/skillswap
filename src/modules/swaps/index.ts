import { Router } from 'express';
import { swapController } from './swap.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import { createSwapRequestSchema, updateSwapStatusSchema } from './swap.model';
import { PERMISSIONS } from '../../constants';

const router = Router();

// Kullanıcının dahil olduğu takas talepleri
router.get('/my-swaps', authMiddleware(PERMISSIONS.SWAPS_READ), swapController.listMySwaps);

// Yeni takas talebi gönderme
router.post('/', authMiddleware(PERMISSIONS.SWAPS_CREATE), validateRequest(createSwapRequestSchema), swapController.createSwapRequest);

// Takas talebini kabul/ret/iptal etme
router.patch('/:id/status', authMiddleware(PERMISSIONS.SWAPS_UPDATE), validateRequest(updateSwapStatusSchema), swapController.updateSwapStatus);

export { router as swapRoutes };
export * from './swap.service';
export * from './swap.controller';
export * from './swap.model';
