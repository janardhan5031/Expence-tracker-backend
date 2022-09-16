const express = require('express');
const router = express.Router();

const expenseControl = require('../controllers/expenseControl');
const auth = require('../controllers/authController');

router.post('/add',auth.userAuthentication,expenseControl.add);

router.get('/get-all',auth.userAuthentication,expenseControl.getAll);

router.post('/delete',auth.userAuthentication,expenseControl.deleteExpense);

module.exports = router;