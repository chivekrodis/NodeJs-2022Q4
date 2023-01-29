import { DB } from './db';
import { ISuggestParams, IUser, IUserToUpdate } from './user.model';

const getAll = async () => await DB.getAll();
const getById = async (id: string) => await DB.getById(id);
const createUser = async (newUserData: IUser) => await DB.createUser(newUserData);
const updateUser = async (id: string, data: IUserToUpdate) => {
  const { login, password, age } = data;

  const updatedUser = {
    ...data,
    ...(login && { login }),
    ...(age && { age }),
    ...(password && { password }),
  };

  await DB.updateUser(id, data);

  delete updatedUser?.password;

  return updatedUser;
};
const deleteUser = async (id: string): Promise<string | null> => {
  const user = await getById(id);

  if (!user || user?.isDeleted) {
    return null;
  }

  await DB.deleteUser(id);

  return id;
};
const getAutoSuggestUser = ({ query, limit }: ISuggestParams) => {
  const searchLimit = limit || '10';

  return DB.getAutoSuggestUser({ query, limit: searchLimit });
};
const addUsersToGroup = async (groupId: string, userIds: string[]): Promise<{ success: boolean; message?: string }> =>
  await DB.addUsersToGroup(groupId, userIds);

export const userService = { getAll, getById, createUser, updateUser, deleteUser, getAutoSuggestUser, addUsersToGroup };
