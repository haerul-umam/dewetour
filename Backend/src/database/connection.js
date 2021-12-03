const Sequelize = require('sequelize')
const db = {}
const sequelize = new Sequelize('dewe_tour',
    'root',
    'Dbuser12345', {
    host: 'localhost',
    dialect: 'mysql',
    logging: console.log,
    freezeTableName: true,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}) 

db.db = sequelize
db.Sequelize = Sequelize

module.exports = db