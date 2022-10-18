const expenses = require('../models/Expences');
const User = require('../models/Users')
const Files = require('../models/expenseFiles')
const AWS = require('aws-sdk');

exports.add = (req,res,next) =>{
    const event = req.body.event;
    const price = Number(req.body.price);
    const Income = req.body.Income;     // true or false
    const Expense = req.body.Expense;    // true or false

    const date = new Date().toISOString().slice(0,10)
    
    console.log(date)

    expenses.create({event,price,Income,Expense,Date:date})
    .then((result)=>{
        //console.log(result)
        if(Expense){
            return User.updateOne(
                {_id: req.user.id},     // filter condition
                {                       // updated data
                    TotalExpense:req.user.TotalExpense+price,
                    UserExpenses : [...req.user.UserExpenses,{
                        ExpenseId : result._id
                        }
                    ]  
                }
            )
        }else{
            return  User.updateOne(
                {_id: req.user.id},
                {                       // updated data
                    TotalIncome:req.user.TotalIncome+price,
                    UserExpenses : [...req.user.UserExpenses,{
                        ExpenseId : result._id
                        }
                    ]  
                }
            )
        }
    })
    .then(result =>{
        //console.log(result);
        res.status(201).json({success:true,msg:'sucessfully expense added'})
    })
    .catch(err =>{
        res.json({sucess:false,msg:'unable to add expense', error:err})
    })
}

// expenses with pagination
exports.getAll = (req,res,next) =>{
    const page = Number(req.query.page);
    // console.log(page)

    // req.user.getExpenses({where:{Expense:true}})
    User.findById(req.user._id)
    .select('UserExpenses')
    .populate('UserExpenses.ExpenseId')
    .exec()
    // limit 2 expenses per page
    .then(expenses =>{
        // console.log(expenses.UserExpenses);
        const filteredArray = expenses.UserExpenses.filter(exp=>{
           if(exp.ExpenseId.Expense === true){ return exp}
        })
        const total_exp = filteredArray.length;

        // console.log(total_exp)
        const start = page*2;
        const end = total_exp>= start+2 ? start+2 : total_exp;

        const prev = page ===0? false :true;
        const next = end>= total_exp ? false: true;
        

        const array = filteredArray.slice(start,end);
        // console.log(array);
        
        res.json({data:array,next:next,prev:prev});
    })
    .catch(err => console.log(err));
}

// get all expenses
exports.getAllExpenses =(req,res,next) =>{
    try{
        User.findById(req.user._id)
        .select('UserExpenses.ExpenseId')   // selecting the specific fields
        .populate('UserExpenses.ExpenseId')     // populating or fetching the data form other model with id
        .exec()
        .then(expenses =>{
            console.log(expenses);
            res.send(expenses);
        })
        .catch(err => console.log(err));
    }
    catch(err){
        console.log(err);
    }
}


exports.deleteExpense = (req,res,next)=>{
    const expenseId = req.body.id;
    
    expenses.findOneAndDelete({id: expenseId})
    .then(result=>{
        // console.log('deleted obj ',result)
        // console.log( 'user obj' ,req.user)
        
        const price = req.user.TotalExpense - result.price;
        const filteredArray = req.user.UserExpenses.filter(exp =>{
            if(exp.ExpenseId.toString() !== result._id.toString()){
                return exp
            }
        })

        // console.log( 'filtered array' ,filteredArray)  

        User.updateOne({ _id: req.user.id},{ 
            TotalExpense :price,
            UserExpenses : filteredArray 
        })
        .then(result =>{
            // console.log(result)
            res.json(result);
        })
        .catch(err => console.log(err))
    })
    .catch(err =>console.log(err))
}

function uploadToS3(data,filename){
    try{
        // create a new instance of s3 access through IAM credentials
        let s3bucket =new AWS.S3({
            accessKeyId:process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey:process.env.AWS_SECRETE_ACCESS_KEY,
            Bucket:process.env.BUCKET_NAME
        })
        // basically creating a bucket is leads to a network call it might be take some time to complete
        // js is not wait for result because of asynchronus nature to over come this use promise
        return new Promise((resolve,reject)=>{
            s3bucket.createBucket(()=>{
                var params = {
                    Bucket:process.env.BUCKET_NAME,
                    Key:filename,
                    Body:data,
                    /* to make file publically accessble to read onlu through access control level */
                    ACL:'public-read'
                }
                s3bucket.upload(params,(err,success)=>{
                    if(err){
                        // if any error, reject function will be taken
                        reject(err)
                    }else{
                        //if success, resolve funcion will be taken
                        console.log(success)
                        resolve(success)
                    }
                })
            })
        }) 
        
    }catch(err){
        res.json({msg:'something went wrong'});
    }
    
    
}


exports.downloadExpenses = async (req,res,next) =>{
    try{
        
        User.findById(req.user._id)
        .select('UserExpenses')
        .populate('UserExpenses.ExpenseId')
        .exec()
        .then(async (expenseArray) =>{
            
            // stringify the all expenses and store it in a .txt file
            const stringifiedExpenses = JSON.stringify(expenseArray);

            // create a new file name every time user clicks download btn to avoid over writening the files
            // make sure that -> / creates a folder formate
            const fileName = `Expense${req.user.id}/${new Date}.txt`;

            // get the file url after the uploading the data into file that gives url as response
            // keep wait the function to get resolve the promise and return the data
            const successResult = await uploadToS3(stringifiedExpenses,fileName);
            //console.log(url)
            // saving the file urls in database
            // await req.user.createFile({fileName:successResult.key,url:successResult.Location})
            Files.create({
                fileName:successResult.key,
                url:successResult.Location,
                UserId : req.user._id
            })
            .then( ()=>{
                
                res.status(200).json({url:successResult.Location,status:'success'});
            })
            .catch(err => console.log(err))
        } )
        .catch(err => console.log(err))
        

    }
    catch(err){
        console.log(err)
        res.status(500).json({msg:'somtheing went wrong' ,error:err})
    }
    
     
}