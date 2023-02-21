import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { asyncErrorHandler, CreateError } from '../../common';
import { getValidationErrors } from '../../utils';
import { GroupSchema, UpdateGroupSchema } from './group.model';

export const groupSchemaValidation = {
  updateGroupSchema: asyncErrorHandler((req: Request, res: Response, next: NextFunction) => {
    try {
      UpdateGroupSchema.parse(req.body);

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        throw new CreateError(400, JSON.stringify(getValidationErrors(error)));
      }
    }
  }),
  createGroupSchema: asyncErrorHandler((req: Request, res: Response, next: NextFunction) => {
    try {
      GroupSchema.parse(req.body);

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        throw new CreateError(400, JSON.stringify(getValidationErrors(error)));
      }
    }
  }),
};
