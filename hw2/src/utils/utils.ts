import { ZodError } from 'zod';
import { IError } from '../types/error.model';

export const omit = <T extends object, K extends keyof T>(obj: T, keys: K[] = []): Omit<T, K> => {
  const _ = { ...obj };
  keys.forEach((key) => delete _[key]);
  return _;
};

export const getValidationErrors = (errors: ZodError): IError[] => {
  const { issues } = errors;

  return issues.map(({ path, message }) => ({ message, ...(path.length && { path }) }));
};
