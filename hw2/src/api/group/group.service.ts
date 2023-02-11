import { DB } from './db';
import { IGroup, IGroupToUpdate } from './group.model';

const getAll = async () => await DB.getAll();
const getById = async (id: string) => await DB.getById(id);
const createGroup = async (data: IGroup) => await DB.createGroup(data);
const updateGroup = async (id: string, group: IGroup, data: IGroupToUpdate) => {
  const { name, permissions } = data;

  const updatedGroup = {
    ...group,
    ...(name && { name }),
    ...(permissions && { permissions }),
  };

  await DB.updateGroup(id, updatedGroup);

  return updatedGroup;
};
const deleteGroup = async (id: string): Promise<string | null> => {
  const group = await getById(id);

  if (!group) {
    return null;
  }

  await DB.deleteGroup(id);

  return id;
};

export const groupService = { getAll, getById, createGroup, updateGroup, deleteGroup };
