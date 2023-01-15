import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { Users } from './models/user.model';

dotenv.config();

const connectionString: string = process.env.DATABASE_URL || '';

export const client = new Sequelize(connectionString);

export const connectToDb = async (fn: () => void) => {
  try {
    await client.authenticate();
    await Users.sync();

    console.info('[DB]: Connection has been established successfully.');

    fn();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};
