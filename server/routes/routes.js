const express = require('express');
const paymentController = require('../controllers/payment-controller')
const authController = require('../controllers/authentication-controller')
const router = express.Router();


//login
router.post('/login', authController.login);

//braintree
router.get('/generateToken', paymentController.generateToken);
router.post('/checkout', paymentController.checkout);
router.post('/customerCheckout', paymentController.customerCheckout);


module.exports = router;