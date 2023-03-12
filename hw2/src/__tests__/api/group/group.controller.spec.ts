import { routes, createAuthorizedRequest, request as unauthorizedRequest } from '../../setup';
import { groupService } from '../../../api/group/group.service';

jest.mock('../../../api/group/group.service');
jest.mock('../../../models/user.model', () => ({
  Users: {
    findOne: jest.fn(() => ({
      login: 'admin',
      password: 'admin1',
      age: 20,
    })),
  },
}));

describe('Group route', () => {
  let authToken: string;
  const request = unauthorizedRequest;
  const mockGroups = [
    { id: 'bc6d9103-4812-4109-825d-1e14eedf4204', name: 'group_1', permissions: ['READ'] },
    { id: '21b5820a-6468-4efe-a7c6-b5a5f85f4e31', name: 'group_2', permissions: ['WRITE'] },
  ];

  beforeAll(async () => {
    const { token } = await (
      await unauthorizedRequest.post(routes.auth.login).send({ login: 'admin', password: 'admin1' })
    ).body;

    authToken = token;
  });

  describe('GET', () => {
    it('should return all groups', async () => {
      (groupService.getAll as jest.Mock).mockResolvedValue(mockGroups);

      const route = routes.group.getAll;

      const response = await createAuthorizedRequest(request.get(route), authToken).expect(200);

      expect(response.body).toEqual(mockGroups);
    });

    it('should return "Param is not UUID"', async () => {
      const groupId = 'not_uuid';
      const route = routes.group.getById(groupId);

      const response = await createAuthorizedRequest(request.get(route), authToken).expect(200);

      expect(response.text).toBe('Param is not UUID');
    });

    it('should return 404 "Not found"', async () => {
      const groupId = '13686c96-44c4-414b-8bd2-a9a361c7ddd5';
      const route = routes.group.getById(groupId);

      (groupService.getById as jest.Mock).mockResolvedValue(null);

      const response = await createAuthorizedRequest(request.get(route), authToken).expect(404);

      expect(response.text).toBe('"Not found"');
    });

    it('should return group by id', async () => {
      const groupId = 'bc6d9103-4812-4109-825d-1e14eedf4204';
      const route = routes.group.getById(groupId);
      const group = mockGroups.find(({ id }) => id === groupId);

      (groupService.getById as jest.Mock).mockResolvedValue(group);

      const response = await createAuthorizedRequest(request.get(route), authToken).expect(200);

      expect(response.body).toEqual(group);
    });
  });

  describe('POST', () => {
    it('should create new group', async () => {
      const route = routes.group.createGroup;
      const newGroupId = '889f41de-7c6e-4a70-8d9d-7510106707af';
      const newGroup = { name: 'group_3', permissions: ['WRITE'] };

      (groupService.createGroup as jest.Mock).mockResolvedValue({
        ...newGroup,
        id: newGroupId,
      });

      const response = await createAuthorizedRequest(request.post(route), authToken).send(newGroup).expect(201);

      expect(response.body).toEqual({
        ...newGroup,
        id: newGroupId,
      });
    });
  });

  describe('PUT', () => {
    it('should update group', async () => {
      const groupId = 'bc6d9103-4812-4109-825d-1e14eedf4204';
      const newGroupData = { permissions: ['DELETE'] };
      const group = mockGroups.find(({ id }) => id === groupId);
      const route = routes.group.updateGroup(groupId);

      (groupService.getById as jest.Mock).mockResolvedValue({ toJSON: () => group });
      (groupService.updateGroup as jest.Mock).mockResolvedValue({ ...group, ...newGroupData });

      const response = await createAuthorizedRequest(request.put(route), authToken).send(newGroupData);

      expect(response.body).toEqual({ ...group, ...newGroupData });
    });
  });

  describe('DELETE', () => {
    it('should delete group', async () => {
      const groupId = 'bc6d9103-4812-4109-825d-1e14eedf4204';
      const route = routes.group.deleteGroup(groupId);

      (groupService.deleteGroup as jest.Mock).mockResolvedValue(groupId);

      const response = await createAuthorizedRequest(request.delete(route), authToken).expect(200);

      expect(response.text).toEqual(groupId);
    });
  });
});
