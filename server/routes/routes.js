const express = require('express');
const paymentController = require('../controllers/payment-controller')
const router = express.Router();

router.get('/generateToken', paymentController.generateToken);
router.post('/checkout', paymentController.checkout);


module.exports = router;