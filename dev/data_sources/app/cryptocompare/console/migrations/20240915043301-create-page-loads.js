'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('page_loads', {
      userAgent: {
        primaryKey: true,
        type: Sequelize.STRING
      },
      time: {
        primaryKey: true,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('page_loads');
  }
};