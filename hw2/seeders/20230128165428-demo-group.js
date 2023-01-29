const { v4: uuidv4 } = require('uuid');

const seedGroups = () => {
  const readOnly = ['READ'];
  const allAccess = ['READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES'];
  return Array(2)
    .fill(undefined)
    .map((_, i) => {
      const date = Date.now();
      return {
        id: uuidv4(),
        name: `Group_${date + i}`,
        permissions: i === 0 ? readOnly : allAccess,
      };
    });
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Groups', seedGroups(), {});
  },
  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Groups', null, {});
  },
};
