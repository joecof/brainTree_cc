const express = require('express');
const paymentController = require('../controllers/payment-controller')
const router = express.Router();

router.get('/generateToken', paymentController.generateToken);

module.exports = router;