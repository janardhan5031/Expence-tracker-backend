const mongoose = require('mongoose');

const path = require('path');

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');           // importing .env module
const bodyParser = require('body-parser');
// const helmet = require('helmet');
// const morgan = require('morgan');

const app =express(); 
app.use(cors());
dotenv.config();    // configuring the dot .enve before we use it


// const user = require('./models/Users');
// const expenses = require('./models/Expences');
// const order = require('./models/orders');
// const password = require('./models/passwords');
// const file = require('./models/expenseFiles');


app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended:false}));


const userRouters = require('./routes/UserRouters');
const expenesRouter = require('./routes/expenses');
const orderRoutes = require('./routes/purchases');
// const passwordRouter = require('./routes/forgetPassword');
const files = require('./routes/userFiles');
const pages= require('./routes/sendPage');

app.use(userRouters);
// app.use('/password',passwordRouter);
app.use('/purchase',orderRoutes);
app.use('/expenses',expenesRouter);
app.use('/files',files);

// serving js and css and html files to frontend
app.use('/public',(req,res,next)=>{

    const files= new Set([
        '/frontEnd/sign_up/signUp.css',
        '/frontEnd/sign_up/signUp.html',
        '/frontEnd/sign_up/signUp.js',
        '/frontEnd/sign_in/sign_in.html',
        '/frontEnd/sign_in/sign_in.css',
        '/frontEnd/sign_in/sign_in.js',
        '/resetPassword/forget.html',
        '/resetPassword/forget.css',
        '/resetPassword/forget.js',
        '/views/page_404.css'
    ]);

    const url= req.url;
    console.log(url);
    if(files.has(url)){
        res.sendFile(path.join(__dirname,`./public${req.url}`));
    }else{
        next();
    }
});

// sending 404 page if requst hit any of the deined paths 
app.use((req,res,next)=>{
    res.sendFile(path.join(__dirname,'./public/views/page_404.html'));
});


mongoose
.connect('mongodb+srv://jani6878:jani_6878@cluster0.ukgd1ck.mongodb.net/test?retryWrites=true&w=majority')
.then(result =>{
    console.log('connected!')

    app.listen(4000);
    //console.log('app is listening');
})
.catch(err => console.log(err));
