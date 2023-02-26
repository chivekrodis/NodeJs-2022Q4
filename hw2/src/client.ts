import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const connectionString: string = process.env.DATABASE_URL || '';

export const client = new Sequelize(connectionString, {
  logging: false,
});

export const connectToDb = async (fn: () => void) => {
  try {
    await client.authenticate();
    await client.sync({ alter: true });

    console.info('[DB]: Connection has been established successfully.');

    fn();

    process.on('exit', () => {
      client.close();
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};
