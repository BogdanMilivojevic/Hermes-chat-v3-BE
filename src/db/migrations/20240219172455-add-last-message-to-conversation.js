'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('Conversations', 'last_message', {
      type: Sequelize.STRING,
    });

    queryInterface.addColumn('Conversations', 'last_message_sender', {
      type: Sequelize.INTEGER,
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Conversations', 'last_message');
    queryInterface.removeColumn('Conversations', 'last_message_sender');
  },
};
