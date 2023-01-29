import { v4 as uuidv4 } from 'uuid';
import * as z from 'zod';
import { Request } from 'express';
import { UserModel } from '../../models/user.model';

export const UserSchema = z.object({
  id: z.string().uuid().optional().default(uuidv4()),
  login: z.string().min(1),
  password: z.string().refine((val) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/.test(val), {
    message: 'Password should contain at least one letter and one number',
  }),
  age: z.number().min(4).max(130),
  isDeleted: z.boolean().optional().default(false),
});

export const UpdateUserSchema = UserSchema.partial().refine((data) => Object.keys(data).length > 0, {
  message: 'Invalid fields',
});

export const SuggestSchema = z.object({
  query: z.string().min(1),
  limit: z.string().optional().default('10'),
});

export type IUser = Pick<UserModel, 'id' | 'login' | 'age' | 'password' | 'isDeleted'>;
export type IUserRequest = {
  user?: UserModel;
} & Request;
export type IUserToResponseUser = Omit<IUser, 'password' | 'isDeleted'>;
export type IUserToUpdate = z.infer<typeof UpdateUserSchema>;
export type ISuggestParams = z.infer<typeof SuggestSchema>;
