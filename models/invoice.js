'use strict';
    const {
      Model
    } = require('sequelize');
    module.exports = (sequelize, DataTypes) => {
      class Invoice extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
          // define association here
          Invoice.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user'
          });
        }
      }
      Invoice.init({
        invoiceNumber: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
        },
        issueDate: {
          type: DataTypes.DATE,
          allowNull: false
        },
        dueDate: DataTypes.DATE,
        amount: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false
        },
        status: {
          type: DataTypes.ENUM('draft', 'sent', 'paid', 'overdue'),
          defaultValue: 'draft'
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        clientName: DataTypes.STRING,
        clientAddress: DataTypes.STRING,
        items: DataTypes.JSON
      }, {
        sequelize,
        modelName: 'Invoice',
      });
      return Invoice;
    };
