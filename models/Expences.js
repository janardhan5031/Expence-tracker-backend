const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Expense = new Schema({
    event:{ type: String, required : true },
    price : { type: Number , required: true},
    Income: { type: Boolean , required: true},
    Expense: { type: Boolean , required: true},
    Date :{ type: String , required: true}
})

module.exports = mongoose.model('Expense',Expense)



// const Sequelize = require('sequelize');

// const database = require('../util/database');

// const expenses = database.define('expenses',{
//     id:{
//         type:Sequelize.INTEGER,
//         autoIncrement:true,
//         allowNull:false,
//         primaryKey:true
//     },
//     event:Sequelize.STRING,
//     price:Sequelize.INTEGER,
//     Income:Sequelize.BOOLEAN,
//     Expense:Sequelize.BOOLEAN
// });

// module.exports = expenses;