import { SuperTest, Test } from 'supertest';
import { routes } from './routes';

export const getToken = async (request: SuperTest<Test>): Promise<string> => {
  const res = await request
    .post(routes.auth.login)
    .set('Accept', 'application/json')
    .send({ login: 'admin', password: 'admin' });

  return `Bearer ${res.body.token}`;
};

export const createAuthorizedRequest = (request: Test, token: string): Test => request.set('Authorization', token);
