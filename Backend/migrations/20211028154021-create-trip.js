'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Trips', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull:false
      },
      country_id: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      accommodation: {
        type: Sequelize.STRING,
        allowNull:false
      },
      transportation: {
        type: Sequelize.STRING,
        allowNull:false
      },
      eat: {
        type: Sequelize.STRING,
        allowNull:false
      },
      day: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      night: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      dateTrip: {
        type: Sequelize.DATE,
        allowNull:false
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      quota: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull:false
      },
      image: {
        type: Sequelize.STRING,
        allowNull:false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Trips');
  }
};