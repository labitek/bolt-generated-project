'use strict';

    /** @type {import('sequelize-cli').Migration} */
    module.exports = {
      async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('Categories', [{
            name: 'Salary',
            description: 'Income from employment',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            name: 'Rent',
            description: 'Expense for housing',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            name: 'Groceries',
            description: 'Expense for food',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ], {});
      },

      async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Categories', null, {});
      }
    };
