
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const files = new Schema({
    fileName:{ type : String , required : true },
    url : { type:String , required : true},

    // relationship
    UserId :{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required : true
    }

})


module.exports = mongoose.model('file',files)



// const sequelize = require('sequelize');
// const database = require('../util/database');

// const files = database.define('files',{
//     id:{
//         type:sequelize.INTEGER,
//         autoIncrement:true,
//         allowNull:false,
//         primaryKey:true
//     },
//     fileName:sequelize.STRING,
//     url:sequelize.STRING
// })

// module.exports = files;