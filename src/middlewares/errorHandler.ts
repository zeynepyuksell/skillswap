import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/apiResponse';
import { logger } from '../utils/logger';

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  logger.error(`${req.method} ${req.url} - ${err.message}`, err.stack);

  if (err instanceof AppError) {
    return ApiResponse.error(res, err.message, err.statusCode);
  }

  return ApiResponse.error(
    res,
    process.env.NODE_ENV === 'production' ? 'Sunucu hatası oluştu' : err.message || 'Sunucu hatası',
    500,
    process.env.NODE_ENV === 'production' ? undefined : err.stack
  );
};
