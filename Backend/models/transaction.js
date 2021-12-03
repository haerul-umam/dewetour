'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.User, {
        as: "customer",
        foreignKey: {
          name: "customer_id"
        }
      })

      Transaction.belongsTo(models.Trip, {
        as: "trip",
        foreignKey: {
          name: "trip_id"
        }
      })
    }
  };
  Transaction.init({
    reservation: DataTypes.INTEGER,
    total: DataTypes.INTEGER,
    status: DataTypes.ENUM('Approved', 'Waiting Payment', 'Waiting Approve', 'Pending', 'Cancel'),
    attachment: DataTypes.STRING,
    trip_id: DataTypes.INTEGER,
    customer_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};