import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CreateError, asyncErrorHandler } from '../../common/errorHandler';

const { JWT_SECRET_KEY } = process.env;

export const checkAuth = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (!JWT_SECRET_KEY) {
    return console.error('JWT_SECRET_KEY not provided');
  }

  const { authorization } = req.headers;

  if (!authorization) {
    return next(new CreateError(401, 'Unauthorized'));
  }

  const token = authorization.replace('Bearer ', '');

  try {
    jwt.verify(token, JWT_SECRET_KEY);
  } catch (err) {
    return next(new CreateError(401, 'Unauthorized'));
  }

  return next();
});
