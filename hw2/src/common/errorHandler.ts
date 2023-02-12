import { NextFunction, Request, Response } from 'express';
import { logger } from './logger';

export class CreateError extends Error {
  statusCode: number;
  message: string;

  constructor(statusCode: number, message: string) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

type IAsyncErrorHandler = (req: Request, res: Response, next: NextFunction) => void;

export const asyncErrorHandler = (fn: IAsyncErrorHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      fn(req, res, next);
    } catch (error) {
      return next(error);
    }
  };
};

type IAsyncErrorHandlerWithParams = (req: Request, res: Response, next: NextFunction, id: string) => void;

export const asyncErrorHandlerWithParams = (fn: IAsyncErrorHandlerWithParams) => {
  return async (req: Request, res: Response, next: NextFunction, id: string) => {
    try {
      fn(req, res, next, id);
    } catch (error) {
      return next(error);
    }
  };
};

export const errorHandler = (err: CreateError, req: Request, res: Response, next: NextFunction) => {
  const { method, query, body, url } = req;
  const { statusCode, message } = err;

  logger.log({
    timestamp: new Date().toISOString(),
    level: 'error',
    method,
    status: statusCode,
    message,
    url,
    query,
    body,
  });

  res.status(err.statusCode).json(err.message);

  next();
};

export const reqLogger = (req: Request, res: Response, next: NextFunction) => {
  const { status, statusMessage } = res;
  const { method, query, body, url } = req;

  logger.log({
    timestamp: new Date().toISOString(),
    level: 'silly',
    status,
    message: statusMessage,
    method,
    url,
    query,
    body,
  });

  next();
};
