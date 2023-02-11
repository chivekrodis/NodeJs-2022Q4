import { Op } from 'sequelize';
import { ISuggestParams, IUser } from './user.model';
import { Groups, Users } from '../../models';
import { UserModel } from '../../models/user.model';
import { client } from '../../client';

const getAll = (): Promise<UserModel[]> => Users.findAll({ where: { isDeleted: false } });

const getById = (id: string): Promise<UserModel | null> => Users.findOne({ where: { id }, plain: true });

const createUser = (newUserData: IUser): Promise<UserModel> => Users.create(newUserData);

const updateUser = async (id: string, DTO: Partial<IUser>): Promise<void> => {
  await Users.update(DTO, {
    where: {
      id,
    },
  });
};

const deleteUser = async (id: string): Promise<void> => {
  const t = await client.transaction();

  try {
    const user = await Users.findOne({ where: { id } });

    if (user) {
      const groups = await user.getGroups();
      if (groups) {
        for (const group of groups) {
          const { id: groupId } = group;
          await user.removeGroups(groupId, { transaction: t });
        }
      }
    }

    await Users.update({ isDeleted: true }, { where: { id }, transaction: t });

    t.commit();
  } catch (error) {
    await t.rollback();
  }
};

const getAutoSuggestUser = async ({ query, limit }: ISuggestParams): Promise<UserModel[]> =>
  await Users.findAll({ where: { login: { [Op.iLike]: `%${query}%` } }, order: [['login', 'ASC']], limit: +limit });

const addUsersToGroup = async (groupId: string, userIds: string[]): Promise<{ success: boolean; message?: string }> => {
  const t = await client.transaction();

  try {
    const group = await Groups.findOne({ where: { id: groupId } });

    if (!group) {
      return { success: false, message: "Group doesn't exist" };
    }

    for (const userId of userIds) {
      const user = await Users.findOne({ where: { id: userId, isDeleted: false } });
      await user?.addGroups(groupId, { transaction: t });
    }

    await t.commit();

    return { success: true };
  } catch (error) {
    await t.rollback();

    return { success: false };
  }
};

export const DB = { getAll, getById, createUser, updateUser, deleteUser, getAutoSuggestUser, addUsersToGroup };
