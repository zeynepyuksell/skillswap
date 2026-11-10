import app from './app';
import { config } from './config/env';
import { logger } from './utils/logger';
import { prisma } from './config/prisma';

const server = app.listen(config.port, () => {
  logger.info(`🚀 SkillSwap Backend sunucusu http://localhost:${config.port} üzerinde çalışıyor`);
  logger.info(`📚 Swagger Dokümantasyonu: http://localhost:${config.port}/api/docs`);
  logger.info(`📝 Ortam: ${config.nodeEnv}`);
});

const gracefulShutdown = async (signal: string) => {
  logger.info(`${signal} sinyali alındı. Sunucu güvenli şekilde kapatılıyor...`);
  server.close(async () => {
    try {
      await prisma.$disconnect();
      logger.info('Prisma veritabanı bağlantısı kesildi.');
      process.exit(0);
    } catch (err) {
      logger.error('Veritabanı bağlantısı kesilirken hata:', err);
      process.exit(1);
    }
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
