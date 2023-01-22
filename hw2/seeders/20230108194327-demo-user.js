const { v4: uuidv4 } = require('uuid');

const seedUsers = () => {
  return Array(20)
    .fill(undefined)
    .map((_, i) => {
      const date = Date.now();
      return {
        id: uuidv4(),
        login: `Login${date + i}`,
        password: `Password${date + i}`,
        age: i + 4,
        isDeleted: false,
      };
    });
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', seedUsers(), {});
  },
  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
