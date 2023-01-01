import { omit } from '../../utils';
import { v4 as uuidv4 } from 'uuid';
import * as z from 'zod';

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
  limit: z.number().optional().default(10),
});

export type IUser = z.infer<typeof UserSchema>;
export type IUserToResponseUser = Omit<IUser, 'password' | 'isDeleted'>;
export type IUserToUpdate = z.infer<typeof UpdateUserSchema>;
export type ISuggestParams = z.infer<typeof SuggestSchema>;

export class User {
  id: string;
  login: string;
  password: string;
  age: number;
  isDeleted: boolean;

  constructor({ id = uuidv4(), login, password, age, isDeleted = false }: IUser) {
    this.id = id;
    this.login = login;
    this.password = password;
    this.age = age;
    this.isDeleted = isDeleted;
  }

  static toResponse(userData: IUser): IUserToResponseUser {
    return omit(userData, ['password', 'isDeleted']);
  }
}
