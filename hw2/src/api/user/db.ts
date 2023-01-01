import { ISuggestParams, IUser, User } from './user.model';
import { v4 as uuidv4 } from 'uuid';

const seedUsers = (users: IUser[]) => {
  Array(20)
    .fill(undefined)
    .map((_, i) => {
      const user: IUser = {
        id: uuidv4(),
        login: `Login ${i}`,
        password: `Password${i}`,
        age: i + 4,
        isDeleted: false,
      };

      users.push(user);
    });
};

const users: IUser[] = [];

seedUsers(users);

const getAll = () => users;

const getById = (userId: string): IUser | undefined => users.find(({ id }) => id === userId);

const createUser = (newUserData: IUser): IUser => {
  const newUser = new User(newUserData);
  users.push(newUser);

  return newUser;
};

const updateUser = (userId: string, DTO: Partial<IUser>): IUser | undefined => {
  const { login, password, age, isDeleted } = DTO;
  const userIndex = users.findIndex((user) => user.id === userId);

  if (userIndex < 0) {
    return;
  }

  const userData = users[userIndex];

  const updatedData = {
    ...userData,
    ...(login && { login }),
    ...(password && { password }),
    ...(age && { age }),
    ...(isDeleted && { isDeleted }),
  };

  users[userIndex] = updatedData;

  return updatedData;
};

const deleteUser = (userId: string) => {
  const user = getById(userId);

  if (!user || user?.isDeleted) {
    return;
  }

  updateUser(userId, { isDeleted: true });

  return userId;
};

const getAutoSuggestUser = ({ query, limit }: ISuggestParams): IUser[] => {
  const suggestions = [];
  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];

    if (user.login.toLocaleLowerCase().includes(query.toLocaleLowerCase())) {
      suggestions.push(user);
    }

    if (suggestions.length === limit) {
      break;
    }
  }

  return suggestions;
};

export const DB = { getAll, getById, createUser, updateUser, deleteUser, getAutoSuggestUser };
