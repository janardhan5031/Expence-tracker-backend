const Users = require('../models/Users');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');   // to encrypt the passwords

exports.signupPage = (req,res,next) =>{
    // check if any user exists with this mail id or not
   const mail = req.body.mail;
   Users.findAll({where:{mail:mail}})
   .then(users =>{
    const user =users[0];
    if(user){
        //if user exists send the response , this mail is exists
        res.send({msg:'this mail is exists'});
    }
    else{
        //else create new user and hashing the user password
        
        const {name,number,mail,password} = req.body;  // it is called destructuring the object
        const saltRounds =10;
        bcrypt.genSalt(saltRounds, ((err,salt_string) =>{
            if(err){
                res.json({error:err});
            }
            bcrypt.hash(password,salt_string,((err,hashed_str) =>{
                if(err){
                    res.json({msg:'unable hash the password'});
                }
                //console.log(hashed_str);
                Users.create({name,mail,number,password:hashed_str})
                .then(result =>{
                    res.status(201).json({msg:'successfully created new user'});
                })
                .catch(err => res.json({success:false,error:err}));

            }))
        }))
        
    }
   })
   .catch(err =>console.log(err));
}

exports.sign_in = (req,res,next) =>{
   const {mail,password} =  req.body;
   Users.findAll({where:{mail:mail}})
   .then(user =>{
        if(user.length>0){
            bcrypt.compare(password,user[0].password,(err,success)=>{
                if(err){
                    res.status(401).json({success:false,msg:'something went wrong in password'});
                }
                if(success){
                    // if password is mactched, create new token for this user and send it

                    const token = jwt.sign(user[0].id,process.env.SECRETE_KEY);

                    res.json({token:token,success:true,msg:'successfully logged in'});
                }else{
                    res.status(404).json({success:false,msg:'password do not matched'})
                }
            })
        }
        else{
            res.json({msg:'user not found'});
        }
   })
   .catch(err =>res.status(404).send({error:err,msg:'something went wrong'}));
}

exports.addExpenses =(req,res,next) =>{
    const event = req.body.event;
    const price = Number(req.body.price);
    req.user.createExpense({event,price})
    .then(result =>{
        res.status(201).json({success:true,msg:'sucessfully expense added'})
    })
    .catch(err =>{
        res.json({sucess:false,msg:'unable to add expense', error:er})
    })
}