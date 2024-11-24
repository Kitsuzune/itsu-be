'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    // drop column productId from transactions table dan tambahkan product list
    await queryInterface.removeColumn('transactions', 'productId');
    await queryInterface.addColumn('transactions', 'productList', {
      type: Sequelize.JSON,
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {

    await queryInterface.removeColumn('transactions', 'productList');
    await queryInterface.addColumn('transactions', 'productId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id',
      },
    });
    
  }
};
