import { GroupModel, Groups } from '../../models';
import { IGroup } from './group.model';

const getAll = (): Promise<GroupModel[]> => Groups.findAll();

const getById = (id: string): Promise<GroupModel | null> => Groups.findOne({ where: { id }, plain: true });

const createGroup = (data: IGroup): Promise<GroupModel> => Groups.create(data);

const updateGroup = async (id: string, DTO: Partial<IGroup>): Promise<void> => {
  await Groups.update(DTO, {
    where: {
      id,
    },
  });
};

const deleteGroup = async (id: string): Promise<void> => {
  await Groups.destroy({
    where: {
      id,
    },
    force: true,
  });
};

export const DB = { getAll, getById, createGroup, updateGroup, deleteGroup };
