import { Router } from 'express';
import { userController } from './user.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import { updateUserProfileSchema } from './user.model';
import { PERMISSIONS } from '../../constants';

const router = Router();

// Genel liste (herkese açık)
router.get('/', userController.listUsers);

// Oturum açmış kullanıcının kendi profili
router.get('/me', authMiddleware(PERMISSIONS.USERS_READ), userController.getMe);
router.patch('/me', authMiddleware(PERMISSIONS.USERS_UPDATE), validateRequest(updateUserProfileSchema), userController.updateMe);

// Kullanıcı profili görüntüleme
router.get('/:id', userController.getUserById);

export { router as userRoutes };
export * from './user.service';
export * from './user.controller';
export * from './user.model';
