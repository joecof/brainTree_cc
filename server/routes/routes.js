const express = require('express');
const paymentController = require('../controllers/payment-controller')
const authController = require('../controllers/authentication-controller')
const braintreeCustomerController = require('../controllers/braintree-customer-controller')
const router = express.Router();


//login
router.post('/login', authController.login);

//braintree
router.post('/generateToken', paymentController.generateToken)
router.post('/addPaymentMethod', paymentController.addPaymentMethod)
router.post('/checkout', paymentController.checkout);
router.post('/3dsCheckout', paymentController.threeDsCheckout)
router.post('/getTransactions', paymentController.getTransactions)
router.post('/refund', paymentController.refund)
router.post('/void', paymentController.void)

//braintree - customer
router.post('/customer/delete', braintreeCustomerController.delete)

module.exports = router;