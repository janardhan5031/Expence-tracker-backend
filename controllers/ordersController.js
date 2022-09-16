const razorpay = require('razorpay');
const orders = require('../models/orders');

exports.purchaseMembership = (req,res,next)=>{
    // declearing and initializing razorpay instace
   // console.log('jani');
    try{
        var instance = new razorpay({
            key_id:'rzp_test_llsCzcV3d1VX4a',
            key_secret:'LGWbPzwTAz93lu5tS1kXEopu'
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
            req.user.createOrder({orderId:order.id,status:'pending'})
            .then(()=>{
                res.json({order,key_id : instance.key_id});
            })
            .catch(err =>{throw new Error(err)});
        })
    }catch(err){
        console.log(err);
    }
}

exports.membershipStatus = (req,res,next) =>{
    const orderId = req.body.orderId;

    orders.findOne({where:{orderId:orderId}})
    .then(order =>{
        order.update({paymentId:req.body.payment_id,status:'success'})
        .then(()=>{
            //console.log(req.user)
           return req.user.update({isPremiumUser:true})
        })
        .then(premiumUser =>{
            return res.status(201).json({staus:'success',msg:'tansaction successfull'})
        })
        .catch(err =>{
            throw new Error(err);
        })
    })
    .catch(err =>{
        res.status(403).json({msd:'something went wrong'});
    })
}