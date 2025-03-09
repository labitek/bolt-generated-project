'use strict';
    const {
      Model
    } = require('sequelize');
    const bcrypt = require('bcryptjs');

    module.exports = (sequelize, DataTypes) => {
      class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
          // define association here
          User.hasMany(models.Transaction, {
            foreignKey: 'userId',
            as: 'transactions'
          });
          User.hasMany(models.Invoice, {
            foreignKey: 'userId',
            as: 'invoices'
          });
        }
      }
      User.init({
        firstName: {
          type: DataTypes.STRING,
          allowNull: false
        },
        lastName: {
          type: DataTypes.STRING,
          allowNull: false
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true
          }
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false
        },
        role: {
          type: DataTypes.ENUM('admin', 'consultant', 'user'),
          defaultValue: 'user'
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          defaultValue: true
        }
      }, {
        sequelize,
        modelName: 'User',
        hooks: {
          beforeCreate: async (user) => {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          },
          beforeUpdate: async (user) => {
            if (user.changed('password')) {
              const salt = await bcrypt.genSalt(10);
              user.password = await bcrypt.hash(user.password, salt);
            }
          }
        }
      });
      User.prototype.validPassword = async function (password) {
        return await bcrypt.compare(password, this.password);
      };
      return User;
    };
