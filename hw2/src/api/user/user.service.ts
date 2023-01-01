import { DB } from './db';
import { ISuggestParams, IUser, IUserToUpdate } from './user.model';

const getAll = (): IUser[] => DB.getAll();
const getById = (id: string): IUser | undefined => DB.getById(id);
const createUser = (newUserData: IUser): IUser => DB.createUser(newUserData);
const updateUser = (id: string, data: IUserToUpdate): IUser | undefined => DB.updateUser(id, data);
const deleteUser = (id: string): string | undefined => DB.deleteUser(id);
const getAutoSuggestUser = ({ query, limit }: ISuggestParams): IUser[] => DB.getAutoSuggestUser({ query, limit });

export const userService = { getAll, getById, createUser, updateUser, deleteUser, getAutoSuggestUser };
