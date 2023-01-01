import express, { Express, Response } from 'express';
import api from './api';

const app: Express = express();

app.use(express.json());

app.get('/', (_, res: Response<string>) => {
  res.json('Hello World');
});

app.use('/api/v1', api);

export default app;
