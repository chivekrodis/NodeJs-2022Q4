import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { getValidationErrors } from '../../utils';
import { GroupSchema, UpdateGroupSchema } from './group.model';

export const groupSchemaValidation = {
  updateGroupSchema: (req: Request, res: Response, next: NextFunction) => {
    try {
      UpdateGroupSchema.parse(req.body);

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).send(getValidationErrors(error));
      }
    }
  },
  createGroupSchema: (req: Request, res: Response, next: NextFunction) => {
    try {
      GroupSchema.parse(req.body);

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).send(getValidationErrors(error));
      }
    }
  },
};
