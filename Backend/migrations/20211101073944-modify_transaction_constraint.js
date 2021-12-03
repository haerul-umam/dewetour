'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    Promise.all([
      queryInterface.removeConstraint("Transactions", "Transactions_ibfk_1"),
      queryInterface.removeConstraint("Transactions", "Transactions_ibfk_2"),
      queryInterface.addConstraint("Transactions",{
        fields:["customer_id"],
        type:"FOREIGN KEY",
        name:"fk_order_cust",
        references:{
          table:"Users",
          field:"id"
        },
        onDelete:"CASCADE",
        onUpdate:"CASCADE"
      }),
      queryInterface.addConstraint("Transactions",{
        fields:["trip_id"],
        type:"FOREIGN KEY",
        name:"fk_order_trip",
        references:{
          table:"Trips",
          field:"id"
        },
        onDelete:"CASCADE",
        onUpdate:"CASCADE"
      }),
    ])
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
