import app from './app';
import dotenv from 'dotenv';
import { connectToDb } from './client';

dotenv.config();

const port = process.env.PORT || 3000;

connectToDb(() => {
  app.listen(port, () => {
    console.info(`[server]: Server is running at http://localhost:${port}`);
  });
});
