const expenses = require('../models/Expences');

exports.add = (req,res,next) =>{
    const event = req.body.event;
    const price = Number(req.body.price);
    req.user.createExpense({event,price})
    .then(()=>{
        req.user.update({expense:req.user.expense+price})
    })
    .then(result =>{
        res.status(201).json({success:true,msg:'sucessfully expense added'})
    })
    .catch(err =>{
        res.json({sucess:false,msg:'unable to add expense', error:er})
    })
}

exports.getAll = (req,res,next) =>{
    req.user.getExpenses()
    .then(expenses =>{
        res.send(expenses);
    })
    .catch(err => console.log(err));
}

exports.deleteExpense = (req,res,next)=>{
    req.user.getExpenses({where:{id:req.body.id}})
    .then(expense=>{
        const price = expense[0].price;

        req.user.update({expense:req.user.expense-price})
        .then(result =>{
            return expense[0].destroy();
        })
        .catch(err => console.log(err));
    })
    .then(result =>{
        res.json(result);
    })
    .catch(err =>console.log(err))
}