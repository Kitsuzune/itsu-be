'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('banners', [
      {
        id: '241f73b0-d6ce-4e96-9288-d971a728c722',
        name: 'Home Carousell',
        image: JSON.stringify([
          `https://preview.redd.it/made-this-anime-banner-in-pixlr-v0-eni9yujjzvxa1.jpg?auto=webp&s=8b871c713fdb41aaf0c08702857ba0e8464534cf`,
          `https://preview.redd.it/made-this-anime-banner-in-pixlr-v0-eni9yujjzvxa1.jpg?auto=webp&s=8b871c713fdb41aaf0c08702857ba0e8464534cf`,
          `https://preview.redd.it/made-this-anime-banner-in-pixlr-v0-eni9yujjzvxa1.jpg?auto=webp&s=8b871c713fdb41aaf0c08702857ba0e8464534cf`
        ]),
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '11a8f69d-305f-40bc-8647-0ce3c0f29470',
        name: 'This Month',
        image: `https://preview.redd.it/made-this-anime-banner-in-pixlr-v0-eni9yujjzvxa1.jpg?auto=webp&s=8b871c713fdb41aaf0c08702857ba0e8464534cf`,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '8f314284-4b20-47ad-8702-56af6beaf738',
        name: 'Explore Product',
        image: `https://preview.redd.it/made-this-anime-banner-in-pixlr-v0-eni9yujjzvxa1.jpg?auto=webp&s=8b871c713fdb41aaf0c08702857ba0e8464534cf`,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '74e0aa79-4f48-4c2d-819d-f77de9537024',
        name: 'New Arrival 1',
        image: `https://preview.redd.it/made-this-anime-banner-in-pixlr-v0-eni9yujjzvxa1.jpg?auto=webp&s=8b871c713fdb41aaf0c08702857ba0e8464534cf`,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '9ff18785-413c-45bd-bcb8-7643524740e9',
        name: 'New Arrival 2',
        image: `https://preview.redd.it/made-this-anime-banner-in-pixlr-v0-eni9yujjzvxa1.jpg?auto=webp&s=8b871c713fdb41aaf0c08702857ba0e8464534cf`,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'c3b5ee40-e682-45bd-9fc7-fea200bb0ca5',
        name: 'New Arrival 3',
        image: `https://preview.redd.it/made-this-anime-banner-in-pixlr-v0-eni9yujjzvxa1.jpg?auto=webp&s=8b871c713fdb41aaf0c08702857ba0e8464534cf`,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '291b066d-3458-4235-87d8-11e29f493cf7',
        name: 'New Arrival 4',
        image: `https://preview.redd.it/made-this-anime-banner-in-pixlr-v0-eni9yujjzvxa1.jpg?auto=webp&s=8b871c713fdb41aaf0c08702857ba0e8464534cf`,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '1eebd320-8c8b-4e4d-9e3f-8eb14f97c852',
        name: 'Store Banner',
        image: `https://preview.redd.it/made-this-anime-banner-in-pixlr-v0-eni9yujjzvxa1.jpg?auto=webp&s=8b871c713fdb41aaf0c08702857ba0e8464534cf`,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('banners', null, {});
  }
};
