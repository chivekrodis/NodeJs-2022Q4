import { Op } from 'sequelize';
import { ISuggestParams, IUser } from './user.model';
import { Users } from '../../models';
import { UserModel } from '../../models/user.model';

const getAll = (): Promise<UserModel[]> => Users.findAll({ where: { isDeleted: false } });

const getById = (id: string): Promise<UserModel | null> =>
  Users.findOne({ where: { id, isDeleted: false }, plain: true });

const createUser = (newUserData: IUser): Promise<UserModel> => Users.create(newUserData);

const updateUser = async (id: string, DTO: Partial<IUser>): Promise<void> => {
  await Users.update(DTO, {
    where: {
      id,
    },
  });
};

const deleteUser = async (id: string): Promise<void> => {
  await Users.update({ isDeleted: true }, { where: { id } });
};

const getAutoSuggestUser = async ({ query, limit }: ISuggestParams): Promise<UserModel[]> =>
  await Users.findAll({ where: { login: { [Op.iLike]: `%${query}%` } }, order: [['login', 'ASC']], limit: +limit });

export const DB = { getAll, getById, createUser, updateUser, deleteUser, getAutoSuggestUser };
