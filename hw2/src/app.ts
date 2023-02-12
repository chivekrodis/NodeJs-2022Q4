import express, { Express, Response } from 'express';
import api from './api';
import { logger, reqLogger, errorHandler } from './common';

const app: Express = express();

app.use(express.json());

app.use(reqLogger);

app.get('/', (_, res: Response<string>) => {
  res.json('Hello World');
});

app.use('/api/v1', api);

app.use(errorHandler);

process.on('uncaughtException', (error, origin) => {
  logger.log({
    timestamp: new Date().toISOString(),
    level: 'error',
    error,
    message: origin,
    stack: error.stack,
  });
});

process.on('unhandledRejection', (reason: Error, promise) => {
  logger.log({
    timestamp: new Date().toISOString(),
    level: 'error',
    message: 'unhandledRejection',
    reason: reason.message,
    promise,
    stack: reason.stack,
  });
});

export default app;
