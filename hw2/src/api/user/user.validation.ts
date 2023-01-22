import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { getValidationErrors } from '../../utils';
import { SuggestSchema, UpdateUserSchema, UserSchema } from './user.model';

export const userSchemaValidation = {
  updateUserSchema: (req: Request, res: Response, next: NextFunction) => {
    try {
      UpdateUserSchema.parse(req.body);

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).send(getValidationErrors(error));
      }
    }
  },
  createUserSchema: (req: Request, res: Response, next: NextFunction) => {
    try {
      UserSchema.parse(req.body);

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).send(getValidationErrors(error));
      }
    }
  },
  suggestUserSchema: (req: Request, res: Response, next: NextFunction) => {
    try {
      SuggestSchema.parse(req.query);

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).send(getValidationErrors(error));
      }
    }
  },
};
