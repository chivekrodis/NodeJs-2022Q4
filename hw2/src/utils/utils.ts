import { ZodError } from 'zod';
import { validate as uuidValidate } from 'uuid';
import { IError } from '../types/error.model';

export const getValidationErrors = (errors: ZodError): IError[] => {
  const { issues } = errors;

  return issues.map(({ path, message }) => ({ message, ...(path.length && { path }) }));
};

export const isUUID = (id: string): boolean => uuidValidate(id);
