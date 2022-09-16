const Sequelize = require('sequelize');

const database = require('../util/database');

const expenses = database.define('expenses',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    event:Sequelize.STRING,
    price:Sequelize.INTEGER
});

module.exports = expenses;