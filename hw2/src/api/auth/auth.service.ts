import { NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CreateError } from '../../common/errorHandler';
import { UserModel, Users } from '../../models';
import { comparePassword } from './auth.utils';

const { JWT_SECRET_KEY, JWT_EXPIRE_TIME } = process.env;
const DEFAULT_JWT_EXPIRE_TIME = '2';

export const verifyUser = async (data: { login: string; password: string }, next: NextFunction) => {
  if (!JWT_SECRET_KEY) {
    return console.error('JWT_SECRET_KEY not provided');
  }

  const { login, password } = data;
  const user = (await Users.findOne({
    where: { login },
    attributes: { include: ['password'] },
    raw: true,
  })) as UserModel;

  const { password: userPassword, ...userData } = user;

  if (!userData) {
    return next(new CreateError(403, 'Forbidden'));
  }

  const passwordIsEqual = comparePassword(password, userPassword);

  if (!passwordIsEqual) {
    return next(new CreateError(403, 'Forbidden'));
  }

  const token = jwt.sign({ id: userData.id, login }, JWT_SECRET_KEY, {
    expiresIn: `${JWT_EXPIRE_TIME || DEFAULT_JWT_EXPIRE_TIME}m`,
  });

  return { user: userData, token };
};
