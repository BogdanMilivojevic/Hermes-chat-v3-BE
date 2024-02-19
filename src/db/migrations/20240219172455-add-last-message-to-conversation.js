'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('Conversations', 'last_message', {
      type: Sequelize.STRING,
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Conversations', 'last_message');
  },
};
