const mongoose = require('mongoose');

const Schema = mongoose.Schema;     // its a class for models entities

const User = new Schema({
    name:{
        type: String,
        required: true
    },
    mail:{ type : String, required:true},
    number : { type: Number, required : true },
    password : { type : String, required : true },
    isPremiumUser : { type : Boolean , required : true },
    TotalIncome: { type: Number , requied: true},
    TotalExpense: { type: Number , requied: true},

    // user - expense relation
    UserExpenses : [
            {
                ExpenseId : { 
                    type: Schema.Types.ObjectId,
                    ref: 'Expense',
                    required:true
                }
            }
        ]

})

module.exports = mongoose.model('User',User);





// const sequelize = require('sequelize');

// const Sequelize = require('../util/database');

// const Users = Sequelize.define('Users',{
//     id:{
//         type:sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull:false,
//         primaryKey:true
//     },
//     name:{
//         type:sequelize.STRING,
//     },
//     mail:{
//         type:sequelize.STRING,
//         unique:true
//     },
//     number:sequelize.INTEGER,
//     password:sequelize.STRING,
//     isPremiumUser:sequelize.BOOLEAN,
//     TotalIncome:sequelize.INTEGER,
//     TotalExpense:sequelize.INTEGER
// })

// module.exports =Users;