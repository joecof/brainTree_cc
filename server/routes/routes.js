const express = require('express');
const paymentController = require('../controllers/payment-controller')
const authController = require('../controllers/authentication-controller')
const router = express.Router();


//login
router.post('/login', authController.login);

//braintree
router.post('/generateToken', paymentController.generateToken);
router.post('/checkout', paymentController.checkout);
router.post('/addPaymentMethod', paymentController.addPaymentMethod);

module.exports = router;