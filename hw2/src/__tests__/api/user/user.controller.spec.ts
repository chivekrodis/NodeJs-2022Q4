import { routes, createAuthorizedRequest, request as unauthorizedRequest } from '../../setup';
import { userService } from '../../../api/user/user.service';

jest.mock('../../../api/user/user.service');
jest.mock('../../../models/user.model', () => ({
  Users: {
    findOne: jest.fn(() => ({
      login: 'admin',
      password: 'admin1',
      age: 20,
    })),
  },
}));

describe('User route', () => {
  let authToken: string;
  const request = unauthorizedRequest;
  const mockUsers = [
    { id: 'bc6d9103-4812-4109-825d-1e14eedf4204', login: 'login_1', password: 'password1', age: 21 },
    { id: '21b5820a-6468-4efe-a7c6-b5a5f85f4e31', login: 'login_2', password: 'password2', age: 22 },
  ];

  beforeAll(async () => {
    const { token } = await (
      await unauthorizedRequest.post(routes.auth.login).send({ login: 'admin', password: 'admin1' })
    ).body;

    authToken = token;
  });

  describe('GET', () => {
    it('should return all users', async () => {
      (userService.getAll as jest.Mock).mockResolvedValue(mockUsers);

      const route = routes.user.getAll;
      const response = await createAuthorizedRequest(request.get(route), authToken).expect(200);

      expect(response.body).toEqual(mockUsers);
    });

    it('should return "Param is not UUID"', async () => {
      const userId = 'not_uuid';
      const route = routes.user.getById(userId);

      const response = await createAuthorizedRequest(request.get(route), authToken).expect(200);

      expect(response.text).toBe('Param is not UUID');
    });

    it('should return 404 "Not found"', async () => {
      const userId = '13686c96-44c4-414b-8bd2-a9a361c7ddd5';
      const route = routes.user.getById(userId);

      (userService.getById as jest.Mock).mockResolvedValue(null);

      const response = await createAuthorizedRequest(request.get(route), authToken).expect(404);

      expect(response.text).toBe('"Not found"');
    });

    it('should return user by id', async () => {
      const userId = 'bc6d9103-4812-4109-825d-1e14eedf4204';
      const route = routes.user.getById(userId);
      const user = mockUsers.find(({ id }) => id === userId);

      (userService.getById as jest.Mock).mockResolvedValue(user);

      const response = await createAuthorizedRequest(request.get(route), authToken).expect(200);

      expect(response.body).toEqual(user);
    });

    it('should return user list filtered by query', async () => {
      const query = 'log';
      const limit = '1';
      const route = routes.user.getAutoSuggestUser(query, limit);

      (userService.getAutoSuggestUser as jest.Mock).mockResolvedValue(
        mockUsers.filter((user) => user.login.includes(query)).slice(0, +limit),
      );

      const response = await createAuthorizedRequest(request.get(route), authToken).expect(200);

      expect(response.body.length).toBe(+limit);
      expect(response.body).toEqual([mockUsers[0]]);
    });
  });

  describe('POST', () => {
    it('should create new user', async () => {
      const route = routes.user.createUser;
      const newUserId = '889f41de-7c6e-4a70-8d9d-7510106707af';
      const newUser = { login: 'newUserLogin', password: 'password1', age: 20 };

      (userService.createUser as jest.Mock).mockResolvedValue({
        ...newUser,
        id: newUserId,
      });

      const response = await createAuthorizedRequest(request.post(route), authToken).send(newUser).expect(201);

      expect(response.body).toEqual({
        ...newUser,
        id: newUserId,
      });
    });

    it('should return "Login already exist"', async () => {
      const route = routes.user.createUser;
      const newUser = { login: 'login_1', password: 'password1', age: 21 };

      (userService.createUser as jest.Mock).mockResolvedValue(null);

      const response = await createAuthorizedRequest(request.post(route), authToken).send(newUser).expect(400);

      expect(response.text).toBe('Login already exist');
    });
  });

  describe('PUT', () => {
    it('should update user', async () => {
      const userId = 'bc6d9103-4812-4109-825d-1e14eedf4204';
      const newUserData = { password: 'password123' };
      const user = mockUsers.find(({ id }) => id === userId);
      const route = routes.user.updateUser(userId);

      (userService.getById as jest.Mock).mockResolvedValue({ toJSON: () => user });
      (userService.updateUser as jest.Mock).mockResolvedValue({ ...user, ...newUserData });

      const response = await createAuthorizedRequest(request.put(route), authToken).send(newUserData).expect(200);

      expect(response.body).toEqual({ ...user, ...newUserData });
    });
  });

  describe('DELETE', () => {
    it('should delete user', async () => {
      const userId = 'bc6d9103-4812-4109-825d-1e14eedf4204';
      const route = routes.user.deleteUser(userId);

      (userService.deleteUser as jest.Mock).mockResolvedValue(userId);

      const response = await createAuthorizedRequest(request.delete(route), authToken).expect(200);

      expect(response.text).toEqual(userId);
    });
  });
});
