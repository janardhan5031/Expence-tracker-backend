const razorpay = require('razorpay');
const Orders = require('../models/orders');
const User = require('../models/Users');

exports.purchaseMembership = (req,res,next)=>{
    // declearing and initializing razorpay instace
   // console.log('jani');
    try{
        var instance = new razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,    // key id stored in .env file
            key_secret: process.env.RAZORPAY_KEY_SECRET    // key secret 
        });
    
        // creating order with this instance
        instance.orders.create({    //options of payment details
            amount: '1000' , // converting rupees from paisa
            currency:"INR",
            payment_capture:false
        }, (err,order) => {  // function which handles the eror and order success_response
            if(err){
                return res.status(400).send({status:'failed'});
            }
            console.log(order)

            Orders.create({ OrderId : order.id.toString() , UserId: req.user._id })
            .then(()=>{
                res.json({order,key_id : instance.key_id});
            })
            .catch(err =>{throw new Error(err)});

            // req.user.createOrder({orderId:order.id,status:'pending'})
            // .then(()=>{
            //     res.json({order,key_id : instance.key_id});
            // })
            // .catch(err =>{throw new Error(err)});
        })
    }catch(err){
        console.log(err);
    }
}

exports.membershipStatus = (req,res,next) =>{
    const orderId = req.body.orderId;

    Orders.updateOne(
        {OrderId:orderId},
        {PaymentId:req.body.payment_id,Status:'success'})
    .then(()=>{
        //console.log(req.user)
       return User.updateOne(
        {_id: req.user._id},
        {isPremiumUser:true})
    })
    .then(premiumUser =>{
        return res.status(201).json({staus:'success',msg:'tansaction successfull'})
    })
    .catch(err =>{
        throw new Error(err);
    })
    
}