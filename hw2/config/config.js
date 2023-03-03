const dotenv = require('dotenv');

dotenv.config();

const { DB_USERNAME_DEV, DB_PASSWOR_DEV, DB_DATABASE_DEV, DB_HOST_DEV, DB_PORT_DEV } = process.env;

module.exports = {
  development: {
    username: DB_USERNAME_DEV,
    password: DB_PASSWOR_DEV,
    database: DB_DATABASE_DEV,
    host: DB_HOST_DEV,
    port: DB_PORT_DEV,
    dialect: 'postgres',
    dialectOptions: {
      useNativeUUID: true,
    },
  },
};
