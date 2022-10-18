
const Users = require('../models/Users');
const jwt = require('jsonwebtoken');    //  libray for web tokens


const bcrypt = require('bcrypt');   // to encrypt the passwords

exports.signupPage = (req,res,next) =>{
    // check if any user exists with this mail id or not
   const mail = req.body.mail;
   Users.find({mail:mail})
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

                const new_user = new Users({
                    name, mail, number, password:hashed_str,
                    isPremiumUser : false,
                    TotalIncome: 0,
                    TotalExpense: 0,
                    UserExpenses :[]
                })
                Users.create(new_user)
                .then(result =>{
                    console.log(result)
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
   Users.find({mail:mail})
   .then(user =>{
    console.log(user)
        if(user.length>0){
            bcrypt.compare(password,user[0].password,(err,success)=>{
                if(err){
                    res.status(401).json({success:false,msg:'something went wrong in password'});
                }
                if(success){
                    // if password is mactched, create new token for this user and send it

                    const userId = (user[0].id)
                    // console.log(userId)

                    const token = jwt.sign(userId,process.env.SECRETE_KEY);

                    const membership = user[0].isPremiumUser;
                    //console.log(membership)
                    res.status(201).json({token:token,membership:membership,success:true,msg:'successfully logged in'});
                }else{
                    res.json({success:false,msg:'password do not matched'})
                }
            })
        }
        else{
            res.json({msg:'user not found. pls sign up'});
        }
   })
   .catch(err =>res.send({error:err,msg:'something went wrong'}));
}


exports.getAllUsersExpenses =(req,res,next) =>{
    Users.find()
    .select('name TotalExpense')
    .exec()
    .then(users =>{
        console.log(users)
        return users.sort((a,b)=>{
            return a.TotalExpense -b.TotalExpense   // assending order
        });
    })
    .then(list =>{
        res.json({data:list,curUsr:req.user.id});
    })
    
    .catch(err => console.log(err));
}

exports.getOne =(req,res,next) => {
    const id = req.params.id;
    //console.log(id);
    // Users.findByPk(id,{attributes:['id','expense']})
    Users.findById(id)
    .select('_id TotalExpense')
    .then(user =>{
        res.json(user)
    }).catch(err =>{
        res.status(404).send({status:'failed',error:err,msg:'something went wrong'})
    })
}
