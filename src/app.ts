import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { config } from './config/env';
import { apiRouter } from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { ApiResponse } from './utils/apiResponse';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './docs/swagger';

const app: Application = express();

// Reverse proxy desteği (IP tabanlı rate limit ve gerçek istemci tespiti için)
app.set('trust proxy', 1);

const trustedOrigins = new Set(
  [
    config.clientUrl,
    'http://localhost:5173',
    'http://localhost:3000',
  ]
    .filter(Boolean)
    .map((url) => url.trim().toLowerCase())
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Origin başlığı olmayan istekler (same-origin, curl, server-to-server) CORS başlıkları olmadan geçer
      if (!origin) {
        return callback(null, false);
      }

      const normalizedOrigin = origin.trim().toLowerCase();

      // "null" origin veya güvenilmeyen domain'leri kesinlikle reddet (CWE-942 önleme)
      if (normalizedOrigin === 'null' || !trustedOrigins.has(normalizedOrigin)) {
        return callback(null, false);
      }

      // Yalnızca beyaz listedeki güvenilir domain'lere izin ver
      return callback(null, true);
    },
    credentials: true,
    maxAge: 86400, // Preflight (OPTIONS) istek sonucunu 24 saat tarayıcıda önbelleğe al
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root Route
app.get('/', (req: Request, res: Response) => {
  return ApiResponse.success(
    res,
    {
      name: 'SkillSwap Backend API',
      documentation: 'http://localhost:5001/api/docs',
      health: 'http://localhost:5001/health',
      frontend: 'http://localhost:5173',
    },
    'SkillSwap Backend çalışıyor. Görsel arayüz (Frontend) http://localhost:5173 adresindedir.'
  );
});

// Health Check
app.get('/health', (req: Request, res: Response) => {
  return ApiResponse.success(res, {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  }, 'SkillSwap API çalışıyor');
});

// Swagger API Dokümantasyonu
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/api/docs.json', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerDocument);
});

// API Routes
app.use('/api/v1', apiRouter);

// 404 Handler
app.use((req: Request, res: Response) => {
  return ApiResponse.error(res, `İstenen kaynak bulunamadı: ${req.originalUrl}`, 404);
});

// Global Error Handler
app.use(errorHandler);

export default app;
