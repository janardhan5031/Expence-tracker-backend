const express = require('express');
const router = express.Router();

const auth = require('../athenticationControl/authController');
const orders = require('../controllers/ordersController');

router.get('/membership',auth.userAuthentication,orders.purchaseMembership);

router.post('/membershipStatus',auth.userAuthentication,orders.membershipStatus)

module.exports = router;