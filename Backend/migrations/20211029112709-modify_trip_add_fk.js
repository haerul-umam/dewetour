'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addConstraint("Trips",{
      fields:["country_id"],
      type:"FOREIGN KEY",
      name:"fk_trip_country",
      references:{
        table:"Countries",
        field:"id"
      },
      onDelete:"CASCADE",
      onUpdate:"CASCADE"
    })
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
