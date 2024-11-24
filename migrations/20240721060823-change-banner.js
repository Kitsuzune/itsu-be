'use strict';

/** @type {import('sequelize-cli').Migration} */

export default {
  async up (queryInterface, Sequelize) {
    return queryInterface.changeColumn('banners', 'image', {
      type: Sequelize.STRING(1000),
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.changeColumn('banners', 'image', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  }
};
