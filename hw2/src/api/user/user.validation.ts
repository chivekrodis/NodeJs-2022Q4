import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { asyncErrorHandler, CreateError } from '../../common';
import { getValidationErrors } from '../../utils';
import { SuggestSchema, UpdateUserSchema, UserSchema } from './user.model';

export const userSchemaValidation = {
  updateUserSchema: asyncErrorHandler((req: Request, res: Response, next: NextFunction) => {
    try {
      UpdateUserSchema.parse(req.body);

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        throw new CreateError(400, JSON.stringify(getValidationErrors(error)));
      }
    }
  }),
  createUserSchema: asyncErrorHandler((req: Request, res: Response, next: NextFunction) => {
    try {
      UserSchema.parse(req.body);

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        throw new CreateError(400, JSON.stringify(getValidationErrors(error)));
      }
    }
  }),
  suggestUserSchema: asyncErrorHandler((req: Request, res: Response, next: NextFunction) => {
    try {
      SuggestSchema.parse(req.query);

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        throw new CreateError(400, JSON.stringify(getValidationErrors(error)));
      }
    }
  }),
};
