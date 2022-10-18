const mongoose =  require('mongoose');
const Schema  = mongoose.Schema;


const Order = new Schema ({
    OrderId :{ type: String, required:true },
    Status : { type: String, default : 'pending'},
    PaymentId : { type: String },

    // relationship 
    UserId :{
        type: Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
})


module.exports = mongoose.model('Order',Order);





// const sequelize = require('../util/database');
// const Sequelize = require('sequelize');

// const orders = sequelize.define('orders',{
//     id:{
//         type:Sequelize.INTEGER,
//         autoIncrement:true,
//         allowNull:false,
//         primaryKey:true
//     },
//     orderId:Sequelize.STRING,
//     paymentId:Sequelize.STRING,
//     status:Sequelize.STRING
// });

// module.exports = orders;