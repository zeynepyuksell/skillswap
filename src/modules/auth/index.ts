import { Router, Request, Response, NextFunction } from 'express';
import { authController } from './auth.controller';
import { validateRequest } from '../../middlewares/validate.middleware';
import { authRateLimiter } from '../../middlewares/rateLimiter';
import { registerSchema } from './auth.model';
import { ApiResponse } from '../../utils/apiResponse';

const router = Router();

// Kullanıcı varlığı sezdirimini (User Enumeration 401!=422) önlemek için standart giriş doğrulayıcı
const validateLoginCredentials = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body || {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Format hatalı, alanlar eksik veya probe istekleri olsa bile daima 401 döndür
  if (
    !email ||
    typeof email !== 'string' ||
    !emailRegex.test(email.trim()) ||
    !password ||
    typeof password !== 'string'
  ) {
    return ApiResponse.error(res, 'Geçersiz e-posta veya şifre', 401);
  }

  req.body.email = email.trim().toLowerCase();
  return next();
};

router.post('/register', authRateLimiter, validateRequest(registerSchema), authController.register);
router.post('/login', authRateLimiter, validateLoginCredentials, authController.login);

export { router as authRoutes };
export * from './auth.service';
export * from './auth.controller';
export * from './auth.model';
export * from './roles';
export * from './authorization.middleware';
