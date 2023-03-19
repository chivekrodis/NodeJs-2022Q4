import { API_VERSION } from '../../constants';

export const routes = {
  auth: {
    login: `${API_VERSION}/login`,
  },
  user: {
    getAll: `${API_VERSION}/user`,
    getById: (id: string) => `${API_VERSION}/user/${id}`,
    createUser: `${API_VERSION}/user`,
    updateUser: (id: string) => `${API_VERSION}/user/${id}`,
    deleteUser: (id: string) => `${API_VERSION}/user/${id}`,
    getAutoSuggestUser: (query: string, limit: string) =>
      `${API_VERSION}/user/suggestion?query=${query}&limit=${limit}`,
  },
  group: {
    getAll: `${API_VERSION}/group`,
    getById: (id: string) => `${API_VERSION}/group/${id}`,
    createGroup: `${API_VERSION}/group`,
    updateGroup: (id: string) => `${API_VERSION}/group/${id}`,
    deleteGroup: (id: string) => `${API_VERSION}/group/${id}`,
  },
};
