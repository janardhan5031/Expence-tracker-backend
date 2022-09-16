const express = require('express');

const router = express.Router();

const userCtrl = require('../controllers/userControllers');
const authCtrl = require('../athenticationControl/authController');

router.post('/signup',userCtrl.signupPage);

router.post(`/sign-in`,userCtrl.sign_in);

router.post('/add-expenses',authCtrl.userAuthentication,userCtrl.addExpenses )

module.exports = router;
