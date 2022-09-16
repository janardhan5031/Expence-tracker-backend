const sequelize = require('sequelize');

const database = new sequelize('expence_tracker','root','MySql@1234',{
    dialect:'mysql',
    host:'localhost'
});

module.exports = database;