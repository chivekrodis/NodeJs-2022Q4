module.exports = {
  development: {
    username: 'postgres',
    password: 'root',
    database: 'nodejs',
    host: '127.0.0.1',
    port: 5432,
    dialect: 'postgres',
    dialectOptions: {
      useNativeUUID: true,
    },
  },
};
