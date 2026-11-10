import { Router } from 'express';
import { authRoutes } from '../modules/auth';
import { userRoutes } from '../modules/users';
import { skillRoutes } from '../modules/skills';
import { swapRoutes } from '../modules/swaps';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/skills', skillRoutes);
router.use('/swaps', swapRoutes);

export { router as apiRouter };
