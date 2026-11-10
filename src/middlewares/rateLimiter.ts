import rateLimit from 'express-rate-limit';
import { ApiResponse } from '../utils/apiResponse';

const isTest = process.env.NODE_ENV === 'test';

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: isTest ? 5 : 10, // Test ortamında 5, prod/dev ortamında 10 deneme
  standardHeaders: true, // `RateLimit-*` standart başlıklarını ekler
  legacyHeaders: true, // `X-RateLimit-*` başlıklarını ekler
  validate: { xForwardedForHeader: false },
  statusCode: 429,
  handler: (req, res) => {
    return ApiResponse.error(
      res,
      'Çok fazla giriş denemesi yapıldı. Lütfen daha sonra tekrar deneyiniz.',
      429
    );
  },
});
