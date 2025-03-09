'use strict';

    /** @type {import('sequelize-cli').Migration} */
    module.exports = {
      async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('Users', [{
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            password: '$2a$10$w.6.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0', // password
            role: 'admin',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            firstName: 'Jane',
            lastName: 'Doe',
            email: 'jane.doe@example.com',
            password: '$2a$10$w.6.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0', // password
            role: 'consultant',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            firstName: 'User',
            lastName: 'Test',
            email: 'user.test@example.com',
            password: '$2a$10$w.6.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0', // password
            role: 'user',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ], {});
      },

      async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Users', null, {});
      }
    };
