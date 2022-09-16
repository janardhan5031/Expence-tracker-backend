const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');           // importing .env module
const bodyParser = require('body-parser');

const user = require('./models/Users');
const expenses = require('./models/Expences');
const order = require('./models/orders');

const app =express(); 
app.use(cors());
dotenv.config();    // configuring the dot .enve before we use it

app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended:false}));

const database = require('./util/database');

const userRouters = require('./routes/UserRouters');
const expenesRouter = require('./routes/expenses');
const orderRoutes = require('./routes/purchases');

app.use(userRouters);
app.use('/purchase',orderRoutes);
app.use('/expenses',expenesRouter);

// associations
user.hasMany(expenses);
expenses.belongsTo(user);

user.hasMany(order);
order.belongsTo(user);

database.
sync()
//sync({force:true})
.then(result =>{
    app.listen(4000);
    //console.log('app is listening');
})
.catch(err => console.log(err));