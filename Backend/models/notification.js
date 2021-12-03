'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Notification.belongsTo(models.User, {
        as: "recipient",
        foreignKey: {
          name: "id_recipient"
        }
      })
      Notification.belongsTo(models.Transaction, {
        as: "transaction",
        foreignKey: {
          name: "id_transaction"
        }
      })
    }
  };
  Notification.init({
    id_recipient: DataTypes.INTEGER,
    id_transaction: DataTypes.INTEGER,
    is_read: DataTypes.ENUM('Y', 'N')
  }, {
    sequelize,
    modelName: 'Notification',
  });
  return Notification;
};